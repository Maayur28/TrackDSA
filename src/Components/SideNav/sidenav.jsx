import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
  TrophyOutlined,
  CodeOutlined,
  LoginOutlined,
  UserOutlined,
  SettingOutlined,
  SketchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideNav = () => {
  const navigate = useNavigate();
  const [collapsed, setcollapsed] = useState(false);

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
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<CodeOutlined />}>
            <Link to="/">Problems</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TrophyOutlined />}>
            <Link to="/top-interview-questions">Top Interview Questions</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<SketchOutlined />} title="DSA Sheet">
            <Menu.Item key="3" icon={<UserOutlined />}>
              Love Babbar
            </Menu.Item>
            <Menu.Item key="4" icon={<UserOutlined />}>
              Striver
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<SettingOutlined />} title="Settings">
            <Menu.Item key="6">Nothing</Menu.Item>
          </SubMenu>
          <Menu.Item
            key="9"
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
