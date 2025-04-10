import React, { useState, useEffect } from "react";
import { Layout, Menu, Image, Avatar } from "antd";
import {
  CodeOutlined,
  LoginOutlined,
  UserOutlined,
  SketchOutlined,
  HomeOutlined,
  MailOutlined,
  LogoutOutlined,
  BookOutlined,
  FileImageOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "./nav.css";
import BreadCrumb from "../Breadcrumb/breadcrumb";
import Home from "../Home/home";
import Account from "../Account/account";
import Problems from "../Problems/problems";
import Login from "../Login/login";
import Register from "../Register/register";
import DSASheet from "../DSASheet/dsaSheet";
import Notes from "../Notes/notes";
import Images from "../Images/images";
import Contact from "../Contact/contact";
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setcurrentPath] = useState("1");
  const width = window.innerWidth;
  const [collapsed, setcollapsed] = useState(width <= 600 ? true : false);
  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (location.pathname === "/problems") setcurrentPath("3");
    else if (location.pathname === "/dsasheet" && params.name === "lovebabbar")
      setcurrentPath("4");
    else if (location.pathname === "/dsasheet" && params.name === "striver")
      setcurrentPath("5");
    else if (location.pathname === "/dsasheet" && params.name === "fraz")
      setcurrentPath("8");
    else if (location.pathname === "/settings") setcurrentPath("6");
    else if (location.pathname === "/login") setcurrentPath("7");
    else if (location.pathname === "/register") setcurrentPath("7");
    else if (location.pathname === "/contact") setcurrentPath("9");
    else if (location.pathname === "/notes") setcurrentPath("10");
    else if (location.pathname === "/images") setcurrentPath("11");
    else if (location.pathname === "/account") setcurrentPath("12");
    else if (location.pathname === "/") setcurrentPath("1");
  }, [location]);

  const handleLoginLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("profileName");
    Cookies.remove("profileImage");
    navigate("/login");
  };

  useEffect(() => {
    localStorage.setItem("sideNavCollapsed", collapsed);
  }, [collapsed]);
  return (
    <Layout className="nav_component">
      <Header className="nav_header">
        <Menu
          style={{
            position: "relative",
            height: "60px",
            margin: "0px !important",
          }}
          mode="horizontal"
        >
          <Menu.Item key="logo" onClick={() => navigate("/")}>
            <Image
              src="/trackdsa-high-resolution-logo-color-on-transparent-background (2).png"
              preview={false}
            />
          </Menu.Item>
          <Menu.Item
            key="linkedIn"
            style={{
              position: "absolute",
              right: "125px"
            }}
          >
            <a
              href="https://www.linkedin.com/in/mayur28/"
              target="_blank"
              rel="noreferrer"
              className="linkedin"
              aria-label="linkedIn"
            >
              <LinkedinOutlined style={{ fontSize: "1.5rem" }} />
            </a>
          </Menu.Item>
          <Menu.Item
            key="github"
            style={{
              position: "absolute",
              right: "175px",
            }}
          >
            <a
              href="https://github.com/Maayur28"
              target="_blank"
              rel="noreferrer"
              className="github"
              aria-label="github"
            >
              <GithubOutlined style={{ fontSize: "1.5rem" }} />
            </a>
          </Menu.Item>
          <Menu.Item
            key="profile"
            style={{
              position: "absolute",
              right: "1px",
              marginTop: "-5px",
            }}
            onClick={() => {
              Cookies.get("accessToken") &&
              Cookies.get("accessToken").endsWith("=") &&
              Cookies.get("refreshToken") &&
              Cookies.get("profileName")
                ? navigate("/account")
                : navigate("/login");
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              Hello,
              {Cookies.get("accessToken") &&
              Cookies.get("accessToken").endsWith("=") &&
              Cookies.get("refreshToken") &&
              Cookies.get("profileName")
                ? ()=>{
                  let fullName = Cookies.get("profileName");
                  if (fullName) {
                    fullName = decodeURIComponent(fullName).split(" ")[0];
                  }
                  return fullName;
                  }
                : "sign in"}
              <Avatar
                style={{
                  marginLeft: "5px",
                  backgroundColor: "#40A9FF",
                }}
                src={
                  Cookies.get("accessToken") &&
                  Cookies.get("accessToken").endsWith("=") &&
                  Cookies.get("refreshToken") ? (
                    Cookies.get("profileImage") === null ||
                    Cookies.get("profileImage") === undefined ||
                    Cookies.get("profileImage") === "undefined" ||
                    Cookies.get("profileImage") === "" ? (
                      <UserOutlined />
                    ) : (
                      Cookies.get("profileImage")
                    )
                  ) : (
                    <UserOutlined />
                  )
                }
                size={32}
              ></Avatar>
            </div>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout
        className="sidenav_component"
        style={{ height: "calc(100vh-55px)", maxWidth: "fit-content" }}
      >
        <Sider
          theme="light"
          trigger={width <= 600 && null}
          collapsible
          collapsed={collapsed}
          onCollapse={() => setcollapsed((prevState) => !prevState)}
        >
          <Menu selectedKeys={[currentPath]} mode="inline">
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            {Cookies.get("accessToken") !== undefined &&
              Cookies.get("refreshToken") !== undefined && (
                <Menu.Item key="12" icon={<UserOutlined />}>
                  <Link to="/account">My Account</Link>
                </Menu.Item>
              )}
            <Menu.Item key="3" icon={<CodeOutlined />}>
              <Link to="/problems">Problems</Link>
            </Menu.Item>
            {Cookies.get("accessToken") !== undefined &&
              Cookies.get("refreshToken") !== undefined && (
                <Menu.Item key="10" icon={<BookOutlined />}>
                  <Link to="/notes">Notes</Link>
                </Menu.Item>
              )}
            {Cookies.get("accessToken") !== undefined &&
              Cookies.get("refreshToken") !== undefined && (
                <Menu.Item key="11" icon={<FileImageOutlined />}>
                  <Link to="/images">Images</Link>
                </Menu.Item>
              )}
            <SubMenu key="sub1" icon={<SketchOutlined />} title="DSA Sheet">
              <Menu.Item key="4" icon={<UserOutlined />}>
                <Link to="/dsasheet?name=lovebabbar">Love Babbar</Link>
              </Menu.Item>
              <Menu.Item key="5" icon={<UserOutlined />}>
                <Link to="/dsasheet?name=striver">Striver</Link>
              </Menu.Item>
              <Menu.Item key="8" icon={<UserOutlined />}>
                <Link to="/dsasheet?name=fraz">Fraz</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<MailOutlined />}>
              <Link to="/contact">Contact</Link>
            </Menu.Item>
            <Menu.Item
              key="7"
              icon={
                Cookies.get("accessToken") &&
                Cookies.get("accessToken").endsWith("=") &&
                Cookies.get("refreshToken") ? (
                  <LogoutOutlined />
                ) : (
                  <LoginOutlined />
                )
              }
              onClick={handleLoginLogout}
            >
              {Cookies.get("accessToken") &&
              Cookies.get("accessToken").endsWith("=") &&
              Cookies.get("refreshToken")
                ? "Logout"
                : location.pathname === "/register"
                ? "Register"
                : "Login"}
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          style={{
            height: "calc(100vh-100px)",
            paddingLeft: "10px",
            width: collapsed ? "95vw" : "89vw",
          }}
        >
          <BreadCrumb />
          <Content
            style={{
              padding: 0,
              marginTop: 0,
              backgroundColor: "white",
            }}
          >
            {location.pathname === "/" ? (
              <Home />
            ) : location.pathname === "/account" ? (
              <Account />
            ) : location.pathname === "/problems" ? (
              <Problems />
            ) : location.pathname === "/login" ? (
              <Login />
            ) : location.pathname === "/register" ? (
              <Register />
            ) : location.pathname === "/dsasheet" ? (
              <DSASheet />
            ) : location.pathname === "/notes" ? (
              <Notes />
            ) : location.pathname === "/contact" ? (
              <Contact />
            ) : location.pathname === "/images" ? (
              <Images />
            ) : null}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Nav;
