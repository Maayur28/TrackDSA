import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  TrophyOutlined,
  CodeOutlined,
  LoginOutlined,
  UserOutlined,
  SettingOutlined,
  SketchOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setcurrentPath] = useState("1");
  const [collapsed, setcollapsed] = useState(false);

  useEffect(() => {
    if (location.pathname === "/top-interview-questions") setcurrentPath("2");
    else if (location.pathname === "/problems") setcurrentPath("3");
    else if (location.pathname === "/lovebabbar") setcurrentPath("4");
    else if (location.pathname === "/striver") setcurrentPath("5");
    else if (location.pathname === "/settings") setcurrentPath("6");
    else if (location.pathname === "/") setcurrentPath("1");
  }, [location]);

  const handleLoginLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
  };
  useEffect(() => {
    localStorage.setItem("sideNavCollapsed", collapsed);
  }, [collapsed]);
  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "fit-content" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setcollapsed((prevState) => !prevState)}
      >
        <div className="logo" />
        <Menu theme="dark" selectedKeys={[currentPath]} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TrophyOutlined />}>
            <Link to="/top-interview-questions">Top Interview Questions</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<CodeOutlined />}>
            <Link to="/problems">Problems</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<SketchOutlined />} title="DSA Sheet">
            <Menu.Item key="4" icon={<UserOutlined />}>
              Love Babbar
            </Menu.Item>
            <Menu.Item key="5" icon={<UserOutlined />}>
              Striver
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="6" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
          </Menu.Item>
          <Menu.Item
            key="7"
            icon={<LoginOutlined />}
            onClick={handleLoginLogout}
          >
            {Cookies.get("accessToken") &&
            Cookies.get("accessToken").endsWith("=")
              ? "Logout"
              : "Login"}
          </Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
};

export default SideNav;
