import {
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { authSelector } from "@store/selectors/selectors";
import { AuthStateType } from "@store/slices/authSlice";
import { RootState } from "@store/store";
import { Avatar, Button, Col, Row, Tooltip } from "antd";
import { Header } from "antd/lib/layout/layout";
import React, { useCallback } from "react";
// import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ToolBar from "./toolbar/ToolBar";

export const SiteHeader = (): React.ReactElement => {
  const navigate = useNavigate();

  const { isAuth } = useSelector<RootState, AuthStateType>(authSelector);

  const login = useCallback(() => navigate("/login"), []);
  const register = useCallback(() => navigate("/register"), []);
  const logout = useCallback(() => navigate("/logout"), []);

  return (
    <Header className="header">
      <div data-testid={"header-data-id"} className="logo" />

      <Row>
        <Col flex="auto">
          <ToolBar isAuthenticated={isAuth} />
        </Col>
        <Col flex="50px">
          {isAuth && (
            <>
              <Avatar
                data-testid={"header-with-auth-data-id"}
                className="header-avatar"
                icon={<UserOutlined />}
              ></Avatar>
            </>
          )}
        </Col>
        {!isAuth ? (
          <Col flex="200px">
            <Tooltip title="Вход" color="geekblue">
              <Button
                data-testid={"header-login-btn-data-id"}
                icon={<LoginOutlined />}
                onClick={login}
              />
            </Tooltip>
            <Tooltip title="Регистрация" color="geekblue">
              <Button
                data-testid={"header-register-btn-data-id"}
                icon={<ProfileOutlined />}
                onClick={register}
              />
            </Tooltip>
          </Col>
        ) : (
          <Col flex="100px">
            <Tooltip title="Выход" color="geekblue">
              {/*?   <Button icon={<LogoutOutlined />} onClick={this.props.logout} />*/}
              <Button icon={<LogoutOutlined />} onClick={logout} />
            </Tooltip>
          </Col>
        )}
      </Row>
    </Header>
  );
};
