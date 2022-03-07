import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { authSelector } from "@store/selectors/selectors";
import { AuthStateType, registerNewUser } from "@store/slices/authSlice";
import { RootState } from "@store/store";
import { Button, Form, Input } from "antd";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

const SignUp: React.FC = () => {
  const dispatch = useDispatch();

  const onAuthLogin = useCallback(async ({ username, password }) => {
    dispatch(
      registerNewUser({
        username,
        password,
      })
    );
  }, []);

  const { isAuth } = useSelector<RootState, AuthStateType>(authSelector);

  return (
    <>
      {isAuth && <Navigate to="/" />}

      <Form
        name="normal_login"
        className="login-center"
        initialValues={{ username: "root", password: "root" }}
        onFinish={onAuthLogin}
        data-testid={"login-form-data-id"}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input
            name="username"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
            data-testid={"login-form-username-data-id"}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            data-testid={"login-form-password-data-id"}
          />
        </Form.Item>

        <Form.Item {...tailLayout} className="action-btn">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            data-testid={"login-form-submit-data-id"}
          >
            Log in
          </Button>

          <Button type="dashed" htmlType="submit" className="login-form-button">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default SignUp;
