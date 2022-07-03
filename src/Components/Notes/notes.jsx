import React, { useState, useEffect } from "react";
import {
  Collapse,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Skeleton,
  Popconfirm,
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
            fetch(`http://localhost:5000/getnotes/${data.userid}`)
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
          fetch("http://localhost:5000/editnote", {
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
          obj.notes.push(values);
          fetch("http://localhost:5000/addnote", {
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
          fetch("http://localhost:5000/deletenote", {
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
            <Collapse accordion onChange={accorChange}>
              {data.map((val, index) => (
                <Panel
                  key={index}
                  style={{ marginTop: "10px" }}
                  header={val.title}
                  extra={
                    <Space size="large" key={val._id}>
                      {currCollape === val._id && val.note !== note && (
                        <Button
                          type="text"
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
                  <div>
                    {
                      <ReactQuill
                        theme="snow"
                        value={note}
                        onChange={setNote}
                      />
                    }
                  </div>
                </Panel>
              ))}
            </Collapse>
          </>
        ) : (
          <>
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
            <Skeleton.Button
              active
              style={{ width: "300px", height: "30px", margin: "20px" }}
            />
          </>
        )}
      </div>
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
            <ReactQuill theme="snow" value={note} onChange={setNote} />
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
