import React, { useEffect, useState } from "react";
import { Card, message, Tag, Tooltip, Skeleton } from "antd";
import Cookies from "js-cookie";
import { EyeOutlined, SendOutlined } from "@ant-design/icons";
import "./home.css";

const { Meta } = Card;
const Home = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:2222/problemoftheday`)
      .then(async (response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          const text = await response.text();
          throw new Error(text);
        }
      })
      .then((data) => {
        setData([...data.totalproblem]);
      })
      .catch((err) => {
        message.error("Sorry!!! Server is busy. Please try again later", 5);
      });
  }, []);
  const handleAdd = (values) => {
    delete values._id;
    delete values.__v;
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
        if (data.accessToken !== false) {
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
              message.success("Added to problems", 5);
            })
            .catch((err) => {
              message.error(err.message, 5);
            });
        } else {
          message.error("Access Denied!!! Please login to continue", 5);
        }
      })
      .catch((err) => {
        message.error(err.message, 5);
      });
  };
  return (
    <div className="home-card-wrapper">
      {data.length > 0 ? (
        <>
          <Card
            style={{ width: "300px", margin: "20px" }}
            cover={<img alt="example" src="/easy.png" />}
            actions={[
              <Tooltip title="View">
                <a href={data[0].url} target="_blank" rel="noopener noreferrer">
                  <EyeOutlined style={{ color: "#1890ff" }} />
                </a>
              </Tooltip>,
              <Tooltip title="Move to Problems">
                <SendOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAdd(data[0])}
                />
              </Tooltip>,
            ]}
          >
            <Meta
              title={data[0].title}
              description={data[0].topic.map((val) => (
                <Tag color="#1890FF" key={val} style={{ margin: "5px" }}>
                  {val}
                </Tag>
              ))}
            />
          </Card>
          <Card
            style={{ width: "300px", margin: "20px" }}
            cover={<img alt="example" src="/medium.png" />}
            actions={[
              <Tooltip title="View">
                <a href={data[0].url} target="_blank" rel="noopener noreferrer">
                  <EyeOutlined style={{ color: "#1890ff" }} />
                </a>
              </Tooltip>,
              <Tooltip title="Move to Problems">
                <SendOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAdd(data[1])}
                />
              </Tooltip>,
            ]}
          >
            <Meta
              title={data[1].title}
              description={data[1].topic.map((val) => (
                <Tag color="#1890FF" key={val} style={{ margin: "5px" }}>
                  {val}
                </Tag>
              ))}
            />
          </Card>
          <Card
            style={{ width: "300px", margin: "20px" }}
            cover={<img alt="example" src="/hard.png" />}
            actions={[
              <Tooltip title="View">
                <a href={data[0].url} target="_blank" rel="noopener noreferrer">
                  <EyeOutlined style={{ color: "#1890ff" }} />
                </a>
              </Tooltip>,
              <Tooltip title="Move to Problems">
                <SendOutlined
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAdd(data[2])}
                />
              </Tooltip>,
            ]}
          >
            <Meta
              title={data[2].title}
              description={data[2].topic.map((val) => (
                <Tag color="#1890FF" key={val} style={{ margin: "5px" }}>
                  {val}
                </Tag>
              ))}
            />
          </Card>
        </>
      ) : (
        <>
          <Skeleton.Button
            active
            style={{ width: "300px", height: "300px", margin: "20px" }}
          />
          <Skeleton.Button
            active
            style={{ width: "300px", height: "300px", margin: "20px" }}
          />
          <Skeleton.Button
            active
            style={{ width: "300px", height: "300px", margin: "20px" }}
          />
        </>
      )}
    </div>
  );
};

export default Home;
