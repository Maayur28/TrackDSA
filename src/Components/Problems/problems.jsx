import { Table, Modal, Input, Space, Button } from "antd";
import {
  SearchOutlined,
  PlusSquareOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import Highlighter from "react-highlight-words";

const Problems = () => {
  const [loading, setIsloading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [searchInput, setsearchInput] = useState("");
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
  // useEffect(() => {
  //   fetch("http://localhost:8080/get", {
  //     headers: {
  //       "x-auth-token": localStorage.getItem("x-auth-token"),
  //     },
  //   })
  //     .then(async (response) => {
  //       if (response.status >= 200 && response.status <= 299) {
  //         return response.json();
  //       } else {
  //         const text = await response.text();
  //         throw new Error(text);
  //       }
  //     })
  //     .then((data) => {
  //       setIsloading((prevState) => !prevState);
  //       setData([...data]);
  //     })
  //     .catch((err) => {
  //       setIsloading((prevState) => !prevState);
  //       setError(err);
  //     });
  // }, [pagination]);

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
    },
    {
      title: "Title",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
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
        multiple: 1,
      },
      width: "10%",
      filters: [
        { text: "Easy", value: "easy" },
        { text: "Medium", value: "medium" },
        { text: "Hard", value: "hard" },
      ],
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: "10%",
      render: () => (
        <Space size="middle">
          <button>Delete</button>
          <button>Edit</button>
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
        onOk={handleAddProblem}
        onCancel={() => setaddProblemVisible(false)}
        footer={[
          <Button key="back" onClick={() => setaddProblemVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleAddProblem}>
            Add
          </Button>,
        ]}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};
export default Problems;
