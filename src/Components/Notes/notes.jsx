import React, { useState, useEffect } from "react";
import {
  Collapse,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Popconfirm,
  BackTop,
  Spin,
} from "antd";
import "./notes.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  PlusSquareOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

const { Panel } = Collapse;

const Notes = () => {
  const [addNoteVisible, setaddNoteVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currCollape, setcurCollapse] = useState(undefined);

  useEffect(() => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      navigate("/login");
    } else {
      setIsSubmitting(true);
      fetch("https://trackdsaauth.herokuapp.com/verifyaccess", {
        method: "POST",
        body: JSON.stringify({
          accessToken: Cookies.get("accessToken"),
          refreshToken: Cookies.get("refreshToken"),
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then(async (response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            const text = await response.text();
            throw new Error(text);
          }
        })
        .then((data) => {
          if (data.accessToken !== false) {
            Cookies.set("accessToken", data.accessToken, {
              expires: 7,
              path: "",
            });
            fetch(
              `https://trackdsaproblems.herokuapp.com/getnotes/${data.userid}`
            )
              .then(async (response) => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json();
                } else {
                  const text = await response.text();
                  throw new Error(text);
                }
              })
              .then((data) => {
                setIsSubmitting(false);
                setData([...data.totalnote]);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view notes", 5);
            setIsSubmitting(false);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          message.error("Please login to view notes", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        });
    }
  }, [navigate]);

  const onEdit = (values) => {
    setIsSubmitting(true);
    fetch("https://trackdsaauth.herokuapp.com/verifyaccess", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        if (data.accessToken !== false) {
          Cookies.set("accessToken", data.accessToken, {
            expires: 7,
            path: "",
          });
          values.userid = data.userid;
          values.note = note;
          fetch("https://trackdsaproblems.herokuapp.com/editnote", {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((data) => {
              setIsSubmitting(false);
              setData([...data.totalnote]);
              setaddNoteVisible(false);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.error("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };

  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://trackdsaauth.herokuapp.com/verifyaccess", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        if (data.accessToken !== false) {
          Cookies.set("accessToken", data.accessToken, {
            expires: 7,
            path: "",
          });
          let obj = {};
          delete values._id;
          delete values.__v;
          obj.userid = data.userid;
          obj.notes = [];
          values.note = note;
          obj.notes.push(values);
          fetch("https://trackdsaproblems.herokuapp.com/addnote", {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((data) => {
              setIsSubmitting(false);
              console.log(data);
              setData([...data.totalnote]);
              setaddNoteVisible(false);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.error("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };

  const confirmDelete = (values) => {
    setIsSubmitting(true);
    fetch("https://trackdsaauth.herokuapp.com/verifyaccess", {
      method: "POST",
      body: JSON.stringify({
        accessToken: Cookies.get("accessToken"),
        refreshToken: Cookies.get("refreshToken"),
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((datas) => {
        if (datas.accessToken !== false) {
          Cookies.set("accessToken", datas.accessToken, {
            expires: 7,
            path: "",
          });
          let obj = {};
          obj.userid = datas.userid;
          obj._id = values._id;
          fetch("https://trackdsaproblems.herokuapp.com/deletenote", {
            method: "DELETE",
            body: JSON.stringify(obj),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((data) => {
              setIsSubmitting(false);
              message.success("Data has been deleted successfully", 3);
              setData([...data.totalnote]);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.success("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };

  const accorChange = (val) => {
    if (val === undefined) {
      setNote("");
      setcurCollapse(val);
    } else {
      setNote(data[val].note);
      setcurCollapse(data[val]._id);
    }
  };

  const handleNoteChange = (value) => {
    setNote(value);
  };

  const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
      <path
        className="ql-stroke"
        d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
      />
    </svg>
  );

  const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
      <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
      <path
        className="ql-stroke"
        d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
      />
    </svg>
  );

  function undoChange() {
    this.quill.history.undo();
  }
  function redoChange() {
    this.quill.history.redo();
  }

  return (
    <>
      <div className="notes-div">
        <h1 style={{ display: "flex", justifyContent: "center" }}>My Notes</h1>
        <div className="notes-head">
          <Button
            size="large"
            type="link"
            icon={<PlusSquareOutlined />}
            onClick={() => {
              form.resetFields();
              setaddNoteVisible(true);
            }}
          >
            Add Notes
          </Button>
        </div>
        {isSubmitting === false ? (
          <>
            <Collapse accordion onChange={accorChange} collapsible="header">
              {data.map((val, index) => (
                <Panel
                  key={index}
                  style={{ marginTop: "10px" }}
                  header={val.title}
                  extra={
                    <Space size="large" key={val._id}>
                      {currCollape === val._id && val.note !== note && (
                        <Button
                          type="link"
                          onClick={() => {
                            onEdit(val);
                          }}
                        >
                          Save
                        </Button>
                      )}
                      <Popconfirm
                        title="Are you sure want to delete?"
                        onConfirm={() => confirmDelete(val)}
                        okText="Yes"
                        cancelText="No"
                        icon={
                          <QuestionCircleOutlined style={{ color: "red" }} />
                        }
                      >
                        <DeleteOutlined style={{ color: "#ff4d4f" }} />
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div className="text-editor">
                    <div className={`toolbar quill${index}`}>
                      <span className="ql-formats">
                        <select className="ql-font" defaultValue="arial">
                          <option value="arial">Arial</option>
                          <option value="comic-sans">Comic Sans</option>
                          <option value="courier-new">Courier New</option>
                          <option value="georgia">Georgia</option>
                          <option value="helvetica">Helvetica</option>
                          <option value="lucida">Lucida</option>
                        </select>
                        <select className="ql-size" defaultValue="medium">
                          <option value="extra-small">Size 1</option>
                          <option value="small">Size 2</option>
                          <option value="medium">Size 3</option>
                          <option value="large">Size 4</option>
                        </select>
                        <select className="ql-header" defaultValue="3">
                          <option value="1">Heading</option>
                          <option value="2">Subheading</option>
                          <option value="3">Normal</option>
                        </select>
                      </span>
                      <span className="ql-formats">
                        <button className="ql-bold" />
                        <button className="ql-italic" />
                        <button className="ql-underline" />
                        <button className="ql-strike" />
                      </span>
                      <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
                        <button className="ql-indent" value="-1" />
                        <button className="ql-indent" value="+1" />
                      </span>
                      <span className="ql-formats">
                        <button className="ql-script" value="super" />
                        <button className="ql-script" value="sub" />
                        <button className="ql-blockquote" />
                        <button className="ql-direction" />
                      </span>
                      <span className="ql-formats">
                        <select className="ql-align" />
                        <select className="ql-color" />
                        <select className="ql-background" />
                      </span>
                      <span className="ql-formats">
                        <button className="ql-link" />
                        <button className="ql-image" />
                        <button className="ql-video" />
                      </span>
                      <span className="ql-formats">
                        <button className="ql-formula" />
                        <button className="ql-code-block" />
                        <button className="ql-clean" />
                      </span>
                      <span className="ql-formats">
                        <button className="ql-undo">
                          <CustomUndo />
                        </button>
                        <button className="ql-redo">
                          <CustomRedo />
                        </button>
                      </span>
                    </div>
                    <ReactQuill
                      theme="snow"
                      value={note}
                      onChange={handleNoteChange}
                      placeholder={"Write something..."}
                      modules={{
                        toolbar: { container: `.quill${index}` },
                        history: {
                          delay: 500,
                          maxStack: 100,
                          userOnly: true,
                        },
                      }}
                      formats={formats}
                    />
                  </div>
                </Panel>
              ))}
            </Collapse>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              height: "80vh",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin tip="Loading..." />
          </div>
        )}
      </div>
      <BackTop />
      <Modal
        title="Add Note"
        visible={addNoteVisible}
        onCancel={() => {
          setaddNoteVisible(false);
        }}
        width={window.innerWidth > 800 ? window.innerWidth - 400 : 360}
        footer={[]}
      >
        <Form
          form={form}
          name="addproblem"
          onFinish={onFinish}
          scrollToFirstError
          autoComplete="on"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please add title" }]}
          >
            <Input placeholder="Exp: Two sum" />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <div className="text-editor">
              <EditorToolbar />
              <ReactQuill
                theme="snow"
                value={note}
                onChange={handleNoteChange}
                placeholder={"Write something..."}
                modules={modules}
                formats={formats}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Add
              </Button>
              <Button
                danger
                onClick={() => setaddNoteVisible(false)}
                disabled={isSubmitting ? true : false}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Notes;
