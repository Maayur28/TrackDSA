import React, { useEffect, useState } from "react";
import { Select, Button, Form, Input, message, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const Profile = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [usernameVerified, setUserNameVerified] = useState(false);
  const [verifyCalled, setVerifyCalled] = useState(false);
  const [profile, setProfile] = useState({});

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
      fetch("https://hippopotamus-gaiters.cyclic.app/verifyaccess", {
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
              `https://hippopotamus-gaiters.cyclic.app/getprofile/${data.userid}`
            )
              .then(async (response) => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json();
                } else {
                  const text = await response.text();
                  throw new Error(text);
                }
              })
              .then((val) => {
                setIsSubmitting(false);
                setProfile(val.profile);
                form.setFieldsValue(val.profile);
              })
              .catch((err) => {
                setIsSubmitting(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view account", 5);
            setIsSubmitting(false);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        })
        .catch((err) => {
          setIsSubmitting(false);
          message.error("Please login to view account", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        });
    }
  }, []);

  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("https://hippopotamus-gaiters.cyclic.app/verifyaccess", {
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
            `https://hippopotamus-gaiters.cyclic.app/updateprofile/${data.userid}`,
            {
              method: "PUT",
              body: JSON.stringify(values),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            }
          )
            .then(async (response) => {
              if (response.status >= 200 && response.status <= 299) {
                return response.json();
              } else {
                const text = await response.text();
                throw new Error(text);
              }
            })
            .then((val) => {
              setIsSubmitting(false);
              message.success("Profile Updated", 3);
              setProfile(val.profile);
              form.setFieldsValue(val.profile);
            })
            .catch((err) => {
              setIsSubmitting(false);
              message.error(err.message, 5);
            });
        } else {
          message.error("Please login to view account", 5);
          navigate("/login");
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };
  const onReset = () => {
    form.resetFields();
    form.setFieldsValue(profile);
    setVerifyCalled(false);
  };
  const verifyUsername = () => {
    if (
      Cookies.get("accessToken") === undefined ||
      Cookies.get("refreshToken") === undefined
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      navigate("/login");
    } else {
      setVerifyCalled(true);
      setValidating(true);
      fetch("https://hippopotamus-gaiters.cyclic.app/verifyaccess", {
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
              `https://hippopotamus-gaiters.cyclic.app/validateusername/${form.getFieldValue(
                "username"
              )}`
            )
              .then(async (response) => {
                if (response.status >= 200 && response.status <= 299) {
                  return response.json();
                } else {
                  const text = await response.text();
                  throw new Error(text);
                }
              })
              .then((val) => {
                setValidating(false);
                setUserNameVerified(val.verified);
              })
              .catch((err) => {
                setValidating(false);
                message.error(
                  "Sorry!!! Server is busy. Please try again later",
                  5
                );
              });
          } else {
            message.error("Please login to view account", 5);
            setValidating(false);
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
          }
        })
        .catch((err) => {
          setValidating(false);
          message.error("Please login to view account", 5);
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          navigate("/login");
        });
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        name="profile"
        onFinish={onFinish}
        autoComplete="on"
        style={{ marginTop: "40px" }}
      >
        <Space>
          <Form.Item
            name="username"
            label="Username"
            tooltip="Username should be minimum of length 5 and unique!"
            hasFeedback={verifyCalled}
            validateStatus={
              verifyCalled
                ? validating
                  ? "validating"
                  : usernameVerified
                  ? "success"
                  : "error"
                : null
            }
            help={
              verifyCalled
                ? validating
                  ? "Validating the username..."
                  : usernameVerified
                  ? "Valid username"
                  : "Invalid username"
                : null
            }
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Typography.Link onClick={verifyUsername}>Verify</Typography.Link>
        </Space>
        <Form.Item
          name="name"
          label="Name"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your name!",
              whitespace: true,
            },
          ]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select gender!",
            },
          ]}
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={isSubmitting}>
            Save
          </Button>
          <Button
            htmlType="button"
            style={{
              margin: "0 8px",
            }}
            onClick={onReset}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
