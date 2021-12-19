import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import "./breadcrumb.css";

const BreadCrumb = () => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const breadcrumbNameMap = {
    // "/top-interview-questions": "Top Interview Questions",
    "/problems": "Problems",
    "/dsasheet?name=lovebabbar": "Love Babbar",
    "/dsasheet?name=striver": "Striver",
    "/dsasheet?name=fraz": "Fraz",
    "/settings": "Settings",
    "/login": "Login",
    "/register": "Register",
    "/forgetpassword": "Forget Password",
    "/reset": "Reset Password",
  };
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  let url;
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    url = `/${pathSnippets.slice(0, index + 1).join("/")}${
      params.name !== undefined ? `?name=${params.name}` : ""
    }`;
    return (
      <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <HomeOutlined />
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <div>
      <h1 className="right-side-top">
        {location.pathname === "/"
          ? "PROBLEMS OF THE DAY"
          : breadcrumbNameMap[url]}
      </h1>
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
