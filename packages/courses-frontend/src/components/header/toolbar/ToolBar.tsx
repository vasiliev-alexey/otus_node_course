import { Menu } from "antd";
import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

//import { connect } from "react-redux";
import { RootState } from "../../../store/store";

// import { RouteComponentProps, withRouter } from "react-router-dom";

function ToolBar(props: ReturnType<typeof mapStateToProps>) {
  const navigate = useNavigate();

  const onMenuClick = useCallback(() => {
    navigate("/course/new");
  }, []);
  return (
    <Menu
      data-testid={"menu-addAdd-data-id"}
      theme="dark"
      mode="horizontal"
      onClick={onMenuClick}
      className="header-toolbar-menu"
    >
      {props.isAuthenticated && (
        <Menu.Item
          data-testid={"ToolBar-addAdd-data-id"}
          key={"add-ads"}
        >{`Создать новый курс`}</Menu.Item>
      )}
    </Menu>
  );
}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuth,
});

export default ToolBar;
