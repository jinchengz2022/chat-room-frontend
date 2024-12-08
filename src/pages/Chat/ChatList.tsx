import { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import { chatRequest, friendRequest } from "../../request";
import { jsonTranstion } from "../../utils/jsonTranstion";
import { CreateChatGroupModal } from "../Friend/CreateChatGroupModal";

const requestStatus: any = {
  0: "待添加",
  1: "已添加",
  2: "已拒绝",
};

export const ChatList = () => {
  const [dataSource, setDateSource] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const getList = async () => {
    const res = await chatRequest.ChatList();
    setDateSource(res.data);
  };

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      title: "会议名称",
    },
    {
      dataIndex: "userCount",
      key: "userCount",
      title: "群聊人数",
    },
    {
      dataIndex: "type",
      key: "type",
      render: (_: boolean) => (_ ? "群聊" : null),
    },
    // {
    //   dataIndex: "state",
    //   key: "state",
    //   render: (_: number) => requestStatus[_],
    // },
    // {
    //   dataIndex: "operate",
    //   key: "operate",
    //   render: (_: any, record: any) => {
    //     return !record.isMe ? (
    //       <div>
    //         <Button
    //           type="link"
    //           onClick={() => agreeOrReject(record.id, "agree")}
    //         >
    //           添加
    //         </Button>
    //         <Button
    //           type="link"
    //           danger
    //           onClick={() => agreeOrReject(record.id, "reject")}
    //         >
    //           拒绝
    //         </Button>
    //       </div>
    //     ) : null;
    //   },
    // },
  ];

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          setModalOpen(true);
        }}
        style={{ marginBottom: 24}}
      >
        加入群聊
      </Button>
      <Table dataSource={dataSource} columns={columns} />
      {modalOpen ? (
        <CreateChatGroupModal
        title="加入群聊"
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};
