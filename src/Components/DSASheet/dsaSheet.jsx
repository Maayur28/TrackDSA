import React, { useEffect, useState } from "react";
import { Table, Input, Space, Button, message, Tag, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { SearchOutlined, SendOutlined, EyeOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const DSASheet = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [topics, settopics] = useState([]);
  const [searchInput, setsearchInput] = useState("");
  const [selectedRowsNumber, setselectedRowsNumber] = useState([]);
  const [selectedRowsData, setselectedRowsData] = useState([]);
  useEffect(() => {
    setIsSubmitting(true);
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    fetch(`https://problems.trackdsa.com/${params.name}`)
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
        setData([...data.totalProblem]);
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
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
  const handleAdd = (values) => {
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
          delete values.__v;
          obj.userid = datas.userid;
          if (values.status !== undefined) {
            obj.problems = [];
            obj.problems.push(values);
          } else if (selectedRowsData.length > 0) {
            obj.problems = [...selectedRowsData];
          } else {
            obj.problems = [...data];
          }
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
              message.success("Added to problems", 5);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.error("Access Denied!!! Please login to continue", 5);
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error("Access Denied!!! Please login to continue", 5);
      });
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
        >
          {text === "1" ? "Easy" : text === "2" ? "Medium" : "Hard"}
        </Tag>
      ),
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
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setselectedRowsNumber([...selectedRowKeys]);
      setselectedRowsData([...selectedRows]);
    },
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
        title={() => (
          <Space>
            {selectedRowsNumber.length === 0 ? (
              <Button loading={isSubmitting} onClick={handleAdd}>
                Move all to problems
              </Button>
            ) : (
              <>
                <Button
                  disabled={selectedRowsNumber.length > 0 ? false : true}
                  loading={isSubmitting}
                  onClick={handleAdd}
                >
                  Move to problems
                </Button>
                <span>
                  {selectedRowsNumber.length > 0
                    ? `Selected ${selectedRowsNumber.length} items`
                    : ""}
                </span>
              </>
            )}
          </Space>
        )}
      />
    </div>
  );
};

export default DSASheet;
