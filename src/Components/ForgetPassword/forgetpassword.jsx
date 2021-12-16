import React, { useState } from "react";
import { Form, Input, Button, message, Spin, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./forgetpassword.css";

const ForgetPassword = () => {
  let navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetStatus, setresetStatus] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setIsSubmitting(true);
    fetch("http://localhost:1111/forgetpassword", {
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
        if (data.status == true) setresetStatus(true);
      })
      .catch((err) => {
        setIsSubmitting(false);
        message.error(err.message, 5);
      });
  };
  return (
    <div className="login">
      {resetStatus ? (
        <Alert
          message="Success"
          description="Reset link has been sent to your email"
          type="success"
          showIcon
        />
      ) : (
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          autoComplete="on"
          onFinish={onFinish}
          style={{ marginTop: "40px" }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              { type: "email", warningOnly: true },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Get Reset Link
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};
export default ForgetPassword;
