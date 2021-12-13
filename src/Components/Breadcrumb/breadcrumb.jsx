import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const BreadCrumb = () => {
  const location = useLocation();
  const breadcrumbNameMap = {
    "/top-interview-questions": "Top Interview Questions",
    "/problems": "Problems",
    "/lovebabbar": "Love Babbar",
    "/striver": "Striver",
    "/settings": "Settings",
    "/login": "Login",
    "/register": "Register",
    "/forgetpassword": "Forget Password",
    "/reset": "Reset Password",
  };
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <HomeOutlined />
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
};

export default BreadCrumb;
