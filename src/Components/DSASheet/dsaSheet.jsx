import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Input,
  Space,
  Button,
  Form,
  Radio,
  Spin,
  message,
  Tag,
  Typography,
  Tooltip,
  Popconfirm,
  Select,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  SearchOutlined,
  PlusSquareOutlined,
  NodeIndexOutlined,
  LineOutlined,
  CheckOutlined,
  FileDoneOutlined,
  FileExclamationOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EyeOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const DSASheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, settopics] = useState([]);
  const [searchInput, setsearchInput] = useState("");
  const [editorVisible, seteditorVisible] = useState(false);
  const [addText, setaddText] = useState({});
  useEffect(() => {
    setIsSubmitting(true);
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    fetch(`http://localhost:2222/${params.name}`)
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
        setData([...data.totalProblem]);
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err.message);
      });
  }, [location]);
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].topic.length; j++) {
        if (
          arr.length === 0 ||
          arr.find((o) => o.text === data[i].topic[j]) === undefined
        )
          arr.push({ text: data[i].topic[j], value: data[i].topic[j] });
      }
    }
    settopics([...arr]);
  }, [data]);
  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setsearchInput(selectedKeys[0]);
  };
  const onFinish = (values) => {
    let obj = { ...addText };
    obj.difficulty = values.difficulty;
    setIsSubmitting(true);
    setError("");
    fetch("http://localhost:1111/verifyaccess", {
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
        console.log(data);
        if (data.accessToken != false) {
          Cookies.set("accessToken", data.accessToken, {
            expires: 7,
            path: "",
          });
          obj.userid = data.userid;
          fetch("http://localhost:2222/addproblem", {
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
              message.success("Added to problems", 5);
              seteditorVisible(false);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
              seteditorVisible(false);
            });
        } else {
          message.error("Access Denied!!! Please login", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err.message);
      });
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setsearchInput("");
  };
  const handleAdd = (text) => {
    setaddText(text);
    seteditorVisible(true);
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
      title: "Topic",
      dataIndex: "topic",
      width: "12%",
      filters: [...topics],
      onFilter: (value, record) => {
        console.log(record, value);
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
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      width: "10%",
      render: (_, value) => {
        return (
          <Space size="large">
            <Tooltip title="View">
              <a href={value.url} target="_blank" rel="noopener noreferrer">
                <EyeOutlined style={{ color: "#1890ff" }} />
              </a>
            </Tooltip>
            <Tooltip title="Move to Problems">
              <SendOutlined
                style={{ cursor: "pointer" }}
                onClick={() => handleAdd(value)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        loading={isSubmitting}
        align="center"
        // title={() => (
        //   <div style={{ float: "right" }}>
        //     <Button type="link" icon={<NodeIndexOutlined />}>
        //       Pick Random
        //     </Button>
        //   </div>
        // )}
      />
      <Modal
        title="Please specify difficulty"
        centered
        visible={editorVisible}
        onCancel={() => seteditorVisible(false)}
        footer={[]}
      >
        <Form
          form={form}
          name="copyprob"
          onFinish={onFinish}
          scrollToFirstError
          autoComplete="on"
        >
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
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Move to problems
              </Button>
              <Button
                danger
                onClick={() => seteditorVisible(false)}
                disabled={isSubmitting ? true : false}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DSASheet;
