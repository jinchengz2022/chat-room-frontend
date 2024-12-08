import { useEffect, useState } from "react";
import { Button, Table, message } from "antd";
import { friendRequest } from "../../request";
import { jsonTranstion } from "../../utils/jsonTranstion";

const requestStatus: any = {
  0: "待添加",
  1: "已添加",
  2: "已拒绝",
};

export const RequestList = () => {
  const [dataSource, setDateSource] = useState([]);

  const getList = async () => {
    const res = await friendRequest.ToAddList();

    setDateSource(res.data);
  };

  const agreeOrReject = async (id: number, action: "agree" | "reject") => {
    const res =
      action === "agree"
        ? await friendRequest.AgreeRequest(id)
        : await friendRequest.RejectRequest(id);
    message.success("操作成功", 1, getList);
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
      dataIndex: "state",
      key: "state",
      render: (_: number) => requestStatus[_],
    },
    {
      dataIndex: "operate",
      key: "operate",
      render: (_: any, record: any) => {
        return !record.isMe ? (
          <div>
            <Button
              type="link"
              onClick={() => agreeOrReject(record.id, "agree")}
            >
              添加
            </Button>
            <Button
              type="link"
              danger
              onClick={() => agreeOrReject(record.id, "reject")}
            >
              拒绝
            </Button>
          </div>
        ) : null;
      },
    },
  ];

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};
