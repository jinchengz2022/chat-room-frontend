import { useNavigate, useLocation } from "react-router-dom";
import { Form, message, Button, Input } from "antd";

import { userRequest } from "../../request/index";
import { UserRegisterRequest } from "../../request/type";

const { Item } = Form;

export const Login = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const navigation = useNavigate();

  const onSubmit = async (
    values: Pick<UserRegisterRequest, "userName" | "password">
  ) => {
    try {
      const res = await userRequest.Login(values);

      if (res.status === 201 || res.status === 200) {
        message.success("登陆成功！", 1, () => navigation("/friend-list"));
      } else {
        message.error(res.data.data);
        return;
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200,
      }}
    >
      <div style={{ width: 400 }}>
        <h2 style={{ marginLeft: 42, textAlign: "center" }}>账号登录</h2>
        <Form
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          form={form}
          onFinish={onSubmit}
        >
          <Item
            name="userName"
            label="用户名"
            rules={[
              {
                required: true,
                message: "please input name",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="password"
            label="密码"
            required
            style={{ marginBottom: 0 }}
            rules={[
              {
                required: true,
                message: "please input password",
              },
            ]}
          >
            <Input.Password />
          </Item>
          <Item label=" " colon={false}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                onClick={() => {
                  navigation("/register");
                }}
              >
                创建账号
              </div>
              <div
                onClick={() => {
                  navigation(
                    pathname.includes("admin") ? "/login" : "/admin/login"
                  );
                }}
              >
                {pathname.includes("admin") ? "用户" : "管理员"}账号
              </div>
              <div>忘记密码？</div>
            </div>
          </Item>
          <Item label=" " colon={false}>
            <Button
              onClick={form.submit}
              type="primary"
              style={{ width: "100%" }}
            >
              登录
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
};
