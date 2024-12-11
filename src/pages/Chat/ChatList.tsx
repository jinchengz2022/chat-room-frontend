import { useEffect, useState } from "react";
import { Button, Menu, Layout } from "antd";
import { chatRequest } from "../../request";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { AddMemberModal } from "./AddMemberModal";

const { Sider, Content } = Layout;

export const ChatList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dataSource, setDateSource] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [menuSelectKeys, setMenuSelectKeys] = useState(id ? [id] : []);

  const getList = async () => {
    const res = await chatRequest.ChatList();
    setDateSource(res.data);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Layout>
      <Sider
        style={{
          paddingTop: 8,
          background: "#fff",
          borderRight: "1px solid rgba(5, 5, 5, 0.06)",
        }}
      >
        {dataSource?.find?.((i: any) => i.id === +id!)?.type === true ? (
          <Button
            onClick={() => {
              setModalOpen(true);
            }}
            style={{ margin: "0 0 24px 12px" }}
          >
            添加成员
          </Button>
        ) : null}

        <Menu
          selectedKeys={menuSelectKeys}
          key="chat-menu"
          style={{ height: "calc(100vh - 130px)", border: "none" }}
          items={dataSource.map((i) => ({
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>{i.name}</span>
                {i.type && i.userCount - 1 !== 0 ? (
                  <span>（{i.userCount - 1}人）</span>
                ) : null}
              </div>
            ),
            key: i.id,
            onClick: (value) => {
              navigate(`/chat-list/chat/${value.key}`);
              setMenuSelectKeys([value.key]);
            },
          }))}
        />
      </Sider>
      <Content style={{ paddingTop: 8, background: "#fff" }}>
        <Outlet />
      </Content>
      {modalOpen ? (
        <AddMemberModal
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            getList();
          }}
        />
      ) : null}
    </Layout>
  );
};
