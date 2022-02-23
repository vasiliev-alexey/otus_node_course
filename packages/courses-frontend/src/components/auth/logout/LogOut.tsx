import { authSelector } from "@store/selectors/selectors";
import { AuthStateType, logout } from "@store/slices/authSlice";
import { RootState } from "@store/store";
import { Button, Descriptions, Form } from "antd";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

export const LogOut: React.FC = () => {
  const dispatch = useDispatch();

  const onAuthLogOut = useCallback(async () => {
    dispatch(logout());
  }, []);

  const { isAuth } = useSelector<RootState, AuthStateType>(authSelector);

  return (
    <>
      {!isAuth && <Navigate to="/" />}

      <Form
        name="normal_login"
        className="login-center"
        initialValues={{ username: "root", password: "root" }}
        onFinish={onAuthLogOut}
        data-testid={"login-form-data-id"}
      >
        <Form.Item>
          <Descriptions title="User Info" layout="horizontal" bordered />
        </Form.Item>

        <Form.Item {...tailLayout} className="action-btn">
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            data-testid={"login-form-submit-data-id"}
          >
            Log Out
          </Button>

          <Button type="dashed" htmlType="submit" className="login-form-button">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
