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
} from "antd";
import {
  SearchOutlined,
  PlusSquareOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Problems = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setIsloading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchInput, setsearchInput] = useState("");
  const [topics, settopics] = useState([]);
  const [pagination, setpagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });
  const [editorVisible, seteditorVisible] = useState(false);
  const handleTableChange = (pagination) => {
    setpagination(pagination);
  };
  const [addProblemVisible, setaddProblemVisible] = useState(false);
  useEffect(() => {
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
          fetch(`http://localhost:2222/getproblems/${data.userid}`)
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
              console.table(data.totalproblem);
              setData([...data.totalproblem]);
            })
            .catch((err) => {
              setIsSubmitting(false);
              console.log(err.message);
            });
        } else {
          message.success("Access Denied!!! Please login", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err.message);
      });
  }, []);

  const onFinish = (values) => {
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
          values.userid = data.userid;
          fetch("http://localhost:2222/addproblem", {
            method: "POST",
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
              console.table(data.totalproblem);
            })
            .catch((err) => {
              setIsSubmitting(false);
              console.log(err.message);
            });
        } else {
          message.success("Access Denied!!! Please login", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        console.log(err.message);
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
    },
    {
      title: "Topic",
      dataIndex: "topic",
      width: "10%",
      filters: [...topics],
    },
    {
      title: "Url",
      dataIndex: "url",
      ...getColumnSearchProps("url"),
    },
    {
      title: "Note",
      dataIndex: "note",
      width: "5%",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      sorter: {
        compare: (a, b) => a.difficulty - b.difficulty,
        multiple: 2,
      },
      width: "10%",
      filters: [
        { text: "Easy", value: 1 },
        { text: "Medium", value: 2 },
        { text: "Hard", value: 3 },
      ],
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "10%",
      render: () => (
        <Space size="middle">
          <Button size="small">Edit</Button>
          <Button size="small" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];
  const handleAddProblem = () => {};
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        title={() => (
          <div style={{ float: "right" }}>
            <Button
              type="text"
              icon={<PlusSquareOutlined />}
              onClick={() => setaddProblemVisible(true)}
            >
              Add Problem
            </Button>
            <Button type="link" icon={<NodeIndexOutlined />}>
              Pick Random
            </Button>
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
        onCancel={() => setaddProblemVisible(false)}
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
            name="url"
            label="Url"
            rules={[{ required: true, message: "Please add url" }]}
          >
            <Input placeholder="Exp: https://leetcode.com/problems/two-sum/" />
          </Form.Item>
          <Form.Item
            name="topic"
            label="Topic"
            rules={[{ required: true, message: "Please add topic" }]}
          >
            <Input placeholder="Exp: Array,Tree etc" />
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
          <Form.Item name="note" label="Note">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                disabled={isSubmitting ? true : false}
              >
                {isSubmitting ? <Spin size="small" /> : "Add"}
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
    </div>
  );
};
export default Problems;
