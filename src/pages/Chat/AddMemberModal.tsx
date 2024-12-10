import { Modal, Form, message, Select } from "antd";
import { FC, useEffect, useState } from "react";
import { chatRequest, userRequest } from "../../request";
import { useParams } from "react-router-dom";

export const AddMemberModal: FC<{
  open: boolean;
  title?: string;
  onCancel: () => void;
}> = ({ open, title = "添加成员", onCancel }) => {
  const { id } = useParams();
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();

  const getUserList = async () => {
    const res = await userRequest.List();
    
    setOptions(res.data.map((i: any) => ({ key: i.id, value: i.id, label: i.userName })));
  };

  useEffect(() => {
    getUserList();
  }, []);

  const onFinish = async (values: { userId: number }) => {
    if (!id) {
      return;
    }
    try {
      const res = await chatRequest.AddGroupMember({
        userId: values.userId,
        chatRoomId: +id,
      });
      if (res.status === 200 || res.status === 201) {
        message.success(`添加成功`, 1, () => {
          onCancel();
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
        <Form.Item name="userId" label="名称">
          <Select options={options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
