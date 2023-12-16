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
  Typography,
  Image,
} from "antd";

import {
  SearchOutlined,
  PlusSquareOutlined,
  NodeIndexOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  QuestionCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  ClearOutlined,
  CheckOutlined,
  LineOutlined,
  MailOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "../Notes/EditorToolbar";
import "react-quill/dist/quill.snow.css";

const { Text } = Typography;

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
  const [previousRandom, setPreviousRandom] = useState({});
  const [solved, setsolved] = useState(0);
  const [selectedRowsNumber, setselectedRowsNumber] = useState([]);
  const [selectedRowsData, setselectedRowsData] = useState([]);
  const [note, setNote] = useState("");
  const [filteredInfo, setFilteredInfo] = useState(null);
  const sendTopics = [];
  for (let i = 0; i < topics.length; i++) {
    sendTopics.push(
      <Option key={i.toString() + topics[i].value} value={topics[i].value}>
        {topics[i].text}
      </Option>
    );
  }
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
      fetch("https://auth.trackdsa.com/verifyaccess", {
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
            fetch(`https://problems.trackdsa.com/getproblems/${data.userid}`)
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

  const shuffle = () => {
    let newData = data.sort(() => Math.random() - 0.5);
    setData([...newData]);
  };

  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://auth.trackdsa.com/verifyaccess", {
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
            values.note = note;
            fetch("https://problems.trackdsa.com/editproblem", {
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
            values.note = note;
            obj.problems.push(values);
            fetch("https://problems.trackdsa.com/addproblem", {
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
    fetch("https://auth.trackdsa.com/verifyaccess", {
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
          fetch("https://problems.trackdsa.com/deleteproblem", {
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
    setNote(text.note);
    settopicdefaultedit([...text.topic]);
    setaddProblemVisible(true);
  };

  const statusCalled = (values) => {
    setIsSubmitting(true);
    fetch("https://auth.trackdsa.com/verifyaccess", {
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
          values.status = !values.status;
          fetch("https://problems.trackdsa.com/editproblem", {
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
          message.error("Please login to view problems", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };

  const openRandom = (text) => {
    let filteredData = [];
    text.forEach((element) => {
      let temp = element;
      if (filteredInfo) {
        if (
          filteredInfo.difficulty != null &&
          filteredInfo.difficulty.length > 0
        ) {
          if (!filteredInfo.difficulty.includes(Number(element.difficulty))) {
            temp = null;
          }
        }
        if (filteredInfo.status != null && filteredInfo.status.length > 0) {
          if (!filteredInfo.status.includes(element.status)) {
            temp = null;
          }
        }
      }
      if (temp) {
        filteredData.push(temp);
      }
    });
    let random = Math.floor(Math.random() * filteredData.length);
    setPreviousRandom(filteredData[random]);
    openModel(filteredData[random]);
  };
  const openModel = (obj) => {
    Modal.info({
      title: (
        <>
          <h3>"Try this problem!!!"</h3>
          <a href={obj.url} target="_blank" rel="noopener noreferrer">
            View
          </a>
        </>
      ),
      content: (
        <>
          <h4>Problem: {obj.title}</h4>
          <h5>
            Difficulty:
            <Tag
              color={
                obj.difficulty === "1"
                  ? "success"
                  : obj.difficulty === "2"
                  ? "warning"
                  : "error"
              }
              style={{ margin: "5px" }}
            >
              {obj.difficulty === "1"
                ? "Easy"
                : obj.difficulty === "2"
                ? "Medium"
                : "Hard"}
            </Tag>
          </h5>
          <h5>
            Topics:
            {obj.topic.map((val) => (
              <Tag color="#001529" key={val} style={{ margin: "5px" }}>
                {val}
              </Tag>
            ))}
          </h5>
        </>
      ),
      icon: false,
      onOk() {},
    });
  };
  const openNotes = (text) => {
    Modal.info({
      title: "Note",
      content: <ReactQuill theme="snow" value={text} readOnly={true} />,
      width: window.innerWidth > 800 ? window.innerWidth - 400 : 360,
      height: 1000,
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
      width: "95px",
      filteredValue: (filteredInfo && filteredInfo.status) || null,
      filters: [
        { text: "Unsolved", value: false },
        { text: "Solved", value: true },
      ],
      onFilter: (value, record) => {
        return record.status.toString() === value.toString();
      },
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
      width: "100px",
      filteredValue: (filteredInfo && filteredInfo.topic) || null,
      filters: [...topics],
      onFilter: (value, record) => {
        return record.topic.includes(value);
      },
      render: (topic) => (
        <>
          {topic.map((tag) => (
            <Text ellipsis={true} type="secondary" code>
              {tag}
            </Text>
          ))}
        </>
      ),
    },
    {
      title: "Title",
      filteredValue: (filteredInfo && filteredInfo.title) || null,
      dataIndex: "title",
      ...getColumnSearchProps("title"),
    },
    {
      title: "Note",
      dataIndex: "note",
      width: "65px",
      align: "left",
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
      width: "125px",
      filteredValue: (filteredInfo && filteredInfo.difficulty) || null,
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
      width: "250px",
      align: "left",
      render: (text) => (
        <Space size="large" key={text}>
          <div key={text}>
            <Checkbox
              checked={text.status}
              onChange={() => statusCalled(text)}
            />
          </div>
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
          <Tooltip title="Send Mail">
            <MailOutlined
              style={{ cursor: "pointer", color: "darkturquoise" }}
              onClick={() => sendQuesMail(text)}
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

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };
  const sendMailOption1 = ["Unsolved", "Solved"];

  const sendMailOption2 = ["Easy", "Medium", "Hard"];

  const sendMail = (values) => {
    setIsSubmitting(true);
    fetch("https://auth.trackdsa.com/verifyaccess", {
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
          let sta = [];
          if (values.prob.includes("Unsolved")) sta.push(false);
          if (values.prob.includes("Solved")) sta.push(true);
          let dif = [];
          if (values.diff.includes("Easy")) dif.push("1");
          if (values.diff.includes("Medium")) dif.push("2");
          if (values.diff.includes("Hard")) dif.push("3");
          values.difficulty = dif;
          values.status = sta;
          for (let i = 0; i < data.length; i++) {
            let found = true;
            if (values.topicsToSend !== undefined) {
              found = false;
              for (let j = 0; j < data[i].topic.length; j++) {
                if (values.topicsToSend.includes(data[i].topic[j])) {
                  found = true;
                  break;
                }
              }
            }
            if (
              values.status.includes(data[i].status) &&
              values.difficulty.includes(data[i].difficulty) &&
              found
            ) {
              arr.push(data[i]);
            }
          }
          let brr = [],
            array = [],
            counter = values.slider,
            retry = 0;
          while (retry < 30 && counter !== 0 && arr.length > 0) {
            let random = Math.floor(Math.random() * arr.length);
            retry++;
            if (!brr.includes(random)) {
              brr.push(random);
              array.push(arr[random]);
              counter--;
              retry = 0;
            }
          }
          if (array.length > 0) {
            fetch("https://problems.trackdsa.com/sendmail", {
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
                form.resetFields();
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

  const sendQuesMail = (values) => {
    setIsSubmitting(true);
    fetch("https://auth.trackdsa.com/verifyaccess", {
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
          let array = [];
          array.push(values);
          fetch("https://problems.trackdsa.com/sendmail", {
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
              form.resetFields();
              setSendMailVisible(false);
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
        onChange={handleChange}
        style={{ maxWidth: "95vw" }}
        scroll={{
          x: 800,
          y: 800,
        }}
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
                  <div>
                    Solved:&nbsp;&nbsp;
                    <Progress
                      percent={Math.round((solved * 100) / data.length)}
                      steps={10}
                      size="small"
                      strokeColor="#52c41a"
                    />
                  </div>
                  <Image
                    style={{ cursor: "pointer" }}
                    src="/shuffle-arrows.png"
                    preview={false}
                    width={20}
                    height={20}
                    onClick={shuffle}
                  />
                </Space>
              ) : null}
            </div>
            <div>
              {previousRandom && Object.keys(previousRandom).length > 0 && (
                <Button type="text" onClick={() => openModel(previousRandom)}>
                  Previous Random
                </Button>
              )}
              {filteredInfo ? (
                <Button
                  type="link"
                  icon={<ClearOutlined />}
                  onClick={() => {
                    setFilteredInfo(null);
                    setsearchInput("");
                  }}
                >
                  Reset Filters
                </Button>
              ) : null}
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
            {editMode ? (
              <>
                <EditorToolbar />
                <ReactQuill
                  theme="snow"
                  value={note}
                  onChange={setNote}
                  modules={modules}
                  formats={formats}
                />
              </>
            ) : (
              <>
                <EditorToolbar />
                <ReactQuill
                  theme="snow"
                  onChange={setNote}
                  modules={modules}
                  formats={formats}
                />
              </>
            )}
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
        title="Maximum 25 problems can be sent"
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
          <Form.Item name="topicsToSend" label="Topics">
            <Select
              mode="multiple"
              size="middle"
              placeholder="Please select"
              style={{ width: "100%" }}
            >
              {sendTopics}
            </Select>
          </Form.Item>
          <Form.Item name="slider" label="Problems">
            <Slider min={1} max={25} />
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
