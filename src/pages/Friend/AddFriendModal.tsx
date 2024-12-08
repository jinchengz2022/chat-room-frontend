import { Modal, Form, Input, message } from "antd";
import { FC } from "react";
import { friendRequest } from "../../request";

export const AddFriendModal: FC<{ open: boolean; onCancel: () => void }> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();

  const onFinish = async (values: { userName: string }) => {
    const res = await friendRequest.AddFriend({ userName: values.userName });
    message.success("发送成功", 1, onCancel);
  };

  return (
    <Modal title="添加好友" onOk={form.submit} onCancel={onCancel} open={open}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="userName" label="用户名称">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
