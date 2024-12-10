import * as React from "react";

import { Button, Menu, Layout, Avatar, message } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { jsonTranstion } from "./utils/jsonTranstion";
import "./app.less";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  borderBottom: "1px solid rgba(5, 5, 5, 0.06)",
  textAlign: "center",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#fff",
  display: "inline-flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const contentStyle: React.CSSProperties = {
  minHeight: 120,
  backgroundColor: "#fff",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#fff",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
};

const userMenu = [
  {
    key: "/friend-list",
    label: "好友列表",
  },
  {
    key: "/request-list",
    label: "请求列表",
  },
  {
    key: "/chat-list",
    label: "聊天列表",
  },
];

export const App = () => {
  const { pathname } = useLocation();
  const { userName, headPic } = jsonTranstion(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = React.useState<string[]>();

  React.useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      message.info("未获取到当前用户信息，请重新登录", 1, () =>
        navigate("/login")
      );
    }
    if (pathname === "/") {
      navigate(userMenu[0].key);
    }

    setSelectKey([`/${pathname.split("/")[1]}`]);
  }, [pathname]);

  const selectMenu = (value: any) => {
    navigate(`${value.key}`);
    setSelectKey(value.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Sider
        style={{
          backgroundColor: "#fff",
          borderRight: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        <Menu
          key="main-menu"
          selectedKeys={selectKey}
          style={{ height: "calc(100vh - 10px)", border: "none" }}
          items={userMenu}
          onClick={selectMenu}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <div />
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <Avatar
                src={headPic}
                style={{ width: 30, marginRight: 12 }}
                alt=""
              />
              <span>{userName}</span>
            </div>
            <Button type="link" onClick={() => navigate("/login")}>
              退出
            </Button>
          </div>
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
};
