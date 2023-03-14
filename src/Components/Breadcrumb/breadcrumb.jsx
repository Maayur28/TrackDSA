import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./breadcrumb.css";

const BreadCrumb = () => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const breadcrumbNameMap = {
    "/problems": "Problems",
    "/dsasheet?name=lovebabbar": "Love Babbar",
    "/dsasheet?name=striver": "Striver",
    "/dsasheet?name=fraz": "Fraz",
    "/settings": "Settings",
    "/account": "Account",
    "/login": "Login",
    "/register": "Register",
    "/forgetpassword": "Forgot Password",
    "/reset": "Reset Password",
    "/contact": "Contact",
    "/notes": "Notes",
    "/images": "Images"
  };
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  let url;
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    url = `/${pathSnippets.slice(0, index + 1).join("/")}${
      params.name !== undefined ? `?name=${params.name}` : ""
    }`;
    return (
      <Breadcrumb.Item key={url} style={{ marginTop: "4px" }}>
        {breadcrumbNameMap[url]}
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/" style={{ marginTop: "4px" }}>
        Home
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <div className="breadcrumb_container">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default BreadCrumb;
