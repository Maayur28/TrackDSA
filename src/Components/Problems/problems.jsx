import {
  Table,
  Modal,
  Input,
  Space,
  Button,
  Form,
  Radio,
  message,
  Tag,
  Tooltip,
  Popconfirm,
  Select,
  Badge,
  Progress,
  Checkbox,
  Slider,
} from "antd";

import {
  SearchOutlined,
  PlusSquareOutlined,
  NodeIndexOutlined,
  LineOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  SendOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Problems = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editMode, seteditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [topics, settopics] = useState([]);
  const [topicdefaultedit, settopicdefaultedit] = useState([]);
  const [solved, setsolved] = useState(0);
  const [selectedRowsNumber, setselectedRowsNumber] = useState([]);
  const [selectedRowsData, setselectedRowsData] = useState([]);
  const topicTags = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Depth-First Search",
    "Sorting",
    "Greedy",
    "Breadth-First Search",
    "Database",
    "Tree",
    "Binary Search",
    "Binary Tree",
    "Matrix",
    "Two pointers",
    "Bit Manipulation",
    "Stack",
    "Design",
    "Heap",
    "Backtracking",
    "Graph",
    "Simulation",
    "Prefix Sum",
    "Sliding Window",
    "Counting",
    "Linked List",
    "Union Find",
    "Recursion",
    "Binary Search Tree",
    "Trie",
    "Divide and Conquer",
    "Bitmask",
    "Queue",
    "Geometry",
  ];
  const topicTagSelect = [];
  for (let i = 0; i < topicTags.length; i++) {
    topicTagSelect.push(
      <Option key={i} value={topicTags[i]}>
        {topicTags[i]}
      </Option>
    );
  }
  const [edit, setedit] = useState({});
  const [editorVisible, seteditorVisible] = useState(false);
  const [addProblemVisible, setaddProblemVisible] = useState(false);
  const [sendMailVisible, setSendMailVisible] = useState(false);
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
              `https://trackdsaproblems.herokuapp.com/getproblems/${data.userid}`
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
                setData([...data.totalproblem]);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view problems", 5);
            setIsSubmitting(false);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          message.error("Please login to view problems", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        });
    }
  }, [navigate]);

  useEffect(() => {
    let arr = [];
    let count = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === true) {
        count = count + 1;
      }
      for (let j = 0; j < data[i].topic.length; j++) {
        if (
          arr.length === 0 ||
          arr.find((o) => o.text === data[i].topic[j]) === undefined
        )
          arr.push({ text: data[i].topic[j], value: data[i].topic[j] });
      }
    }
    setsolved(count);
    settopics([...arr]);
  }, [data]);

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
          if (editMode) {
            values._id = edit._id;
            values.userid = data.userid;
            fetch("https://trackdsaproblems.herokuapp.com/editproblem", {
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
                setData([...data.totalproblem]);
                setaddProblemVisible(false);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(err.message, 5);
              });
          } else {
            let obj = {};
            delete values._id;
            delete values.__v;
            obj.userid = data.userid;
            obj.problems = [];
            obj.problems.push(values);
            fetch("https://trackdsaproblems.herokuapp.com/addproblem", {
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
                setData([...data.totalproblem]);
                setaddProblemVisible(false);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(err.message, 5);
              });
          }
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
  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchInput(selectedKeys[0]);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setsearchInput("");
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
          if (values.status !== undefined) {
            obj.problems = [];
            obj.problems.push(values);
          } else if (selectedRowsData.length > 0) {
            let arr = [];
            for (let i = 0; i < selectedRowsData.length; i++) {
              arr.push(selectedRowsData[i]._id);
            }
            obj.problems = [...arr];
          } else {
            let arr = [];
            for (let i = 0; i < data.length; i++) {
              arr.push(data[i]._id);
            }
            obj.problems = [...arr];
          }
          fetch("https://trackdsaproblems.herokuapp.com/deleteproblem", {
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
              setselectedRowsNumber([]);
              setselectedRowsData([]);
              setData([...data.totalproblem]);
              setaddProblemVisible(false);
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
  const editData = (text) => {
    setedit({ ...edit, ...text });
    form.setFieldsValue(text);
    seteditMode(true);
    settopicdefaultedit([...text.topic]);
    setaddProblemVisible(true);
  };

  const openRandom = (text) => {
    let random = Math.floor(Math.random() * text.length);
    Modal.info({
      title: (
        <>
          <h3>"Why not try this problem!!!"</h3>
          <a href={text[random].url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </>
      ),
      content: (
        <>
          <h4>Problem: {text[random].title}</h4>
          {text[random].topic.map((val) => (
            <Tag color="#001529" key={val} style={{ margin: "5px" }}>
              {val}
            </Tag>
          ))}
        </>
      ),
      icon: false,
      onOk() {},
    });
  };
  const openNotes = (text) => {
    Modal.info({
      title: "Note",
      content: text,
      onOk() {},
    });
  };
  const getColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder="Search problem title"
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => handleReset(clearFilters)}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record ? record.title.toLowerCase().includes(value.toLowerCase()) : "",
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchInput]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ),
  });

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 1,
      },
      render: (text) => {
        return (
          <div key={text}>
            {text === false ? (
              <LineOutlined />
            ) : (
              <CheckOutlined style={{ color: "darkgreen" }} />
            )}
          </div>
        );
      },
    },
    {
      title: "Topic",
      dataIndex: "topic",
      width: "12%",
      filters: [...topics],
      onFilter: (value, record) => {
        return record.topic.includes(value);
      },
      render: (topic) => (
        <>
          {topic.map((tag) => (
            <Tag style={{ marginBottom: "5px" }} key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Note",
      dataIndex: "note",
      width: "5%",
      render: (text) => (
        <div key={text}>
          {text.length > 0 ? (
            <Badge dot>
              <FileDoneOutlined
                onClick={() => openNotes(text)}
                style={{ color: "#1890FF" }}
              />
            </Badge>
          ) : (
            <FileExclamationOutlined />
          )}
        </div>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      sorter: {
        compare: (a, b) => a.difficulty - b.difficulty,
        multiple: 2,
      },
      width: "5%",
      filters: [
        { text: "Easy", value: 1 },
        { text: "Medium", value: 2 },
        { text: "Hard", value: 3 },
      ],
      onFilter: (value, record) => {
        return record.difficulty.toString() === value.toString();
      },
      render: (text) => (
        <Tag
          color={text === "1" ? "success" : text === "2" ? "warning" : "error"}
          key={text}
        >
          {text === "1" ? "Easy" : text === "2" ? "Medium" : "Hard"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "10%",
      render: (text) => (
        <Space size="large" key={text}>
          <Tooltip title="View">
            <a href={text.url} target="_blank" rel="noopener noreferrer">
              <EyeOutlined style={{ color: "#1890ff" }} />
            </a>
          </Tooltip>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ cursor: "pointer" }}
              onClick={() => editData(text)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure want to delete?"
            onConfirm={() => confirmDelete(text)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <DeleteOutlined style={{ color: "#ff4d4f" }} />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setselectedRowsNumber([...selectedRowKeys]);
      setselectedRowsData([...selectedRows]);
    },
  };

  const sendMailOption1 = ["Unsolved", "Solved"];

  const sendMailOption2 = ["Easy", "Medium", "Hard"];

  const sendMail = (values) => {
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
          let arr = [];
          if (values.prob === "Unsolved") values.status = false;
          else values.status = true;
          if (values.diff === "Easy") values.difficulty = "1";
          else if (values.diff === "Medium") values.difficulty = "2";
          else values.difficulty = "3";
          console.log(values);
          for (let i = 0; i < data.length; i++) {
            if (
              data[i].status === values.status &&
              data[i].difficulty === values.difficulty
            ) {
              arr.push(data[i]);
            }
          }
          console.log(arr);
          let brr = [],
            array = [],
            counter = values.slider;
          while (counter !== 0 && arr.length > 0) {
            let random = Math.floor(Math.random() * arr.length);
            if (!brr.includes[random]) {
              brr.push(random);
              array.push(arr[random]);
              counter--;
            }
          }
          if (array.length > 0) {
            fetch("https://trackdsaproblems.herokuapp.com/sendmail", {
              method: "POST",
              body: JSON.stringify(array),
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
                message.success("Problems sent successfully", 5);
                setSendMailVisible(false);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(err.message, 5);
              });
          } else {
            message.info("No problems to send!!! Please try again", 5);
            setIsSubmitting(false);
            form.resetFields();
          }
        } else {
          message.error("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        form.resetFields();
        message.error(err.message, 5);
      });
  };

  return (
    <div>
      <Table
        columns={columns}
        rowSelection={{ ...rowSelection }}
        dataSource={data}
        loading={isSubmitting}
        rowKey={(record) => record._id}
        align="center"
        title={(currentPageData) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              {data.length > 0 ? (
                <Space>
                  {selectedRowsNumber.length === 0 ? (
                    <Button loading={isSubmitting} onClick={confirmDelete}>
                      Delete all
                    </Button>
                  ) : (
                    <>
                      <Button
                        disabled={selectedRowsNumber.length > 0 ? false : true}
                        loading={isSubmitting}
                        onClick={confirmDelete}
                      >
                        Delete
                      </Button>
                      <span>
                        {selectedRowsNumber.length > 0
                          ? `Selected ${selectedRowsNumber.length} items`
                          : ""}
                      </span>
                    </>
                  )}
                  <span>
                    Solved:&nbsp;&nbsp;
                    <Progress
                      percent={Math.round((solved * 100) / data.length)}
                      steps={10}
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </span>
                </Space>
              ) : null}
            </div>
            <div>
              <Button
                type="link"
                icon={<SendOutlined />}
                onClick={() => {
                  form.resetFields();
                  setSendMailVisible(true);
                }}
              >
                Send Mail
              </Button>
              <Button
                type="text"
                icon={<PlusSquareOutlined />}
                onClick={() => {
                  seteditMode(false);
                  setedit({});
                  form.resetFields();
                  setaddProblemVisible(true);
                }}
              >
                Add Problem
              </Button>
              {data.length > 0 ? (
                <Button
                  type="link"
                  icon={<NodeIndexOutlined />}
                  onClick={() => openRandom(data)}
                >
                  Pick Random
                </Button>
              ) : null}
            </div>
          </div>
        )}
      />
      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={editorVisible}
        onOk={() => seteditorVisible(false)}
        onCancel={() => seteditorVisible(false)}
      >
        <textarea
          name="editor"
          id="editor"
          rows="5"
          style={{ width: "100%" }}
        ></textarea>
      </Modal>
      <Modal
        title="Add Problem"
        visible={addProblemVisible}
        onCancel={() => {
          setaddProblemVisible(false);
        }}
        width={360}
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
          <Form.Item name="url" label="Url">
            <Input placeholder="Exp: https://leetcode.com/problems/two-sum/" />
          </Form.Item>
          <Form.Item
            name="topic"
            label="Topic"
            rules={[{ required: true, message: "Please add topic" }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Exp: Array, Math, String etc"
              value={[topicdefaultedit]}
            >
              {topicTagSelect}
            </Select>
          </Form.Item>
          <Form.Item
            name="difficulty"
            label="Difficulty"
            rules={[{ required: true, message: "Please select difficulty" }]}
          >
            <Radio.Group>
              <Radio value="1">Easy</Radio>
              <Radio value="2">Medium</Radio>
              <Radio value="3">Hard</Radio>
            </Radio.Group>
          </Form.Item>
          {editMode ? (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Radio.Group>
                <Radio value={false}>Not Solved</Radio>
                <Radio value={true}>Solved</Radio>
              </Radio.Group>
            </Form.Item>
          ) : null}
          <Form.Item name="note" label="Note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Add
              </Button>
              <Button
                danger
                onClick={() => setaddProblemVisible(false)}
                disabled={isSubmitting ? true : false}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Maximum 5 problems can be sent"
        visible={sendMailVisible}
        onCancel={() => {
          setSendMailVisible(false);
        }}
        width={360}
        footer={[]}
      >
        <Form
          form={form}
          name="sendMail"
          onFinish={sendMail}
          autoComplete="on"
          initialValues={{ prob: "Unsolved", diff: "Easy", slider: 3 }}
        >
          <Form.Item name="prob" label="Solved">
            <Checkbox.Group options={sendMailOption1} />
          </Form.Item>
          <Form.Item name="diff" label="Difficulty">
            <Checkbox.Group options={sendMailOption2} />
          </Form.Item>
          <Form.Item name="slider" label="Problems">
            <Slider min={1} max={5} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Send Mail
              </Button>
              <Button
                danger
                onClick={() => form.resetFields()}
                disabled={isSubmitting ? true : false}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default Problems;
