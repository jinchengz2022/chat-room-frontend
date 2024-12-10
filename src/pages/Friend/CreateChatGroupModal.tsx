import { Modal, Form, Input, message } from "antd";
import { FC } from "react";
import { chatRequest } from "../../request";
import { useNavigate } from "react-router-dom";

export const CreateChatGroupModal: FC<{
  open: boolean;
  title?: string;
  onCancel: () => void;
}> = ({ open, title = "创建群聊", onCancel }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string }) => {
    try {
      const res = await chatRequest.CreateGroup(values.name);
      if (res.status === 200 || res.status === 201) {
        message.success(`创建成功`, 1, () => {
          onCancel();
          navigate("/chat-list");
        });
      } else {
        message.error(res.data);
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };

  return (
    <Modal title={title} onOk={form.submit} onCancel={onCancel} open={open}>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="name" label="群名称">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
