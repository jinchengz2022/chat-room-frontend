import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import { chatRequest, friendRequest } from "../../request";
import { AddFriendModal } from "./AddFriendModal";
import { useNavigate } from "react-router-dom";
import { CreateChatGroupModal } from "./CreateChatGroupModal";

export const FriendList = () => {
  const navigate = useNavigate();
  const [dataSource, setDateSource] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [createChatGroupModalOpen, setCreateChatGroupModalOpen] =
    useState(false);

  const createOneByOne = async (friendId: number) => {
    const res = await chatRequest.CreateOneByOne(friendId);
    if (res.data) {
      navigate(`/chat-list/${res.data}`);
    }
  };

  const columns = [
    {
      dataIndex: "userName",
      key: "userName",
    },
    {
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      dataIndex: "email",
      key: "email",
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: (_: any, record: any) => {
        return (
          <Button type="link" onClick={() => createOneByOne(record.id)}>
            发起聊天
          </Button>
        );
      },
    },
  ];

  const getList = async () => {
    const res = await friendRequest.FriendListRequest();
    console.log(res);

    setDateSource(res.data);
  };
  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setAddModalOpen(true);
        }}
        style={{ margin: "0 12px 24px 0" }}
      >
        添加好友
      </Button>
      <Button
        onClick={() => {
          setCreateChatGroupModalOpen(true);
        }}
      >
        创建群聊
      </Button>

      <Table dataSource={dataSource} columns={columns} />
      {addModalOpen ? (
        <AddFriendModal
          open={addModalOpen}
          onCancel={() => setAddModalOpen(false)}
        />
      ) : null}
      {createChatGroupModalOpen ? (
        <CreateChatGroupModal
          open={createChatGroupModalOpen}
          onCancel={() => {
            setCreateChatGroupModalOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
