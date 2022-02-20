import {
  LoginOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ThunkProps } from "@src/utils/types-helper";
import { Avatar, Button, Col, Row, Tooltip } from "antd";
import { Header } from "antd/lib/layout/layout";
import React, { Component } from "react";
// import { RouteComponentProps, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { RootState } from "../../store/store";
import ToolBar from "./ToolBar";

export class SiteHeader extends Component<
  // RouteComponentProps &
  ReturnType<typeof mapStateToProps> &
    ThunkProps<typeof mapDispatchThunkToProps>
> {
  render(): React.ReactElement {
    return (
      <Header className="header">
        <div data-testid={"header-data-id"} className="logo" />

        <Row>
          <Col flex="auto">
            <ToolBar isAuthenticated={true} />
          </Col>
          <Col flex="50px">
            {this.props.isAuthenticated && (
              <>
                <Avatar
                  data-testid={"header-with-auth-data-id"}
                  className="header-avatar"
                  icon={<UserOutlined />}
                ></Avatar>
              </>
            )}
          </Col>
          {!this.props.isAuthenticated ? (
            <Col flex="200px">
              <Tooltip title="Вход" color="geekblue">
                <Button
                  data-testid={"header-login-btn-data-id"}
                  icon={<LoginOutlined />}
                  onClick={() => {
                    // this.props.history.push("/login/");
                  }}
                />
              </Tooltip>
              <Tooltip title="Регистрация" color="geekblue">
                <Button
                  data-testid={"header-register-btn-data-id"}
                  icon={<ProfileOutlined />}
                  onClick={() => {
                    // this.props.history.push("/register/");
                  }}
                />
              </Tooltip>
            </Col>
          ) : (
            <Col flex="100px">
              <Tooltip title="Выход" color="geekblue">
                {/*?   <Button icon={<LogoutOutlined />} onClick={this.props.logout} />*/}
                <Button icon={<LogoutOutlined />} />
              </Tooltip>
            </Col>
          )}
        </Row>
      </Header>
    );
  }
}
const mapDispatchThunkToProps = {
  // logout: logout,
};

const mapStateToProps = (state: RootState) => ({
  userName: state.auth.userName,
  isAuthenticated: state.auth.isAuth,
});
export default connect(mapStateToProps, { ...mapDispatchThunkToProps })(
  // withRouter(SiteHeader)
  SiteHeader
);
