import { Menu } from "antd";
import React, { Component } from "react";

//import { connect } from "react-redux";
import { RootState } from "../../../store/store";
// import { RouteComponentProps, withRouter } from "react-router-dom";

class ToolBar extends Component<ReturnType<typeof mapStateToProps>> {
  #onClick = () => {
    //this.props.history.push("/newAd");
  };

  render() {
    return (
      <Menu
        data-testid={"menu-addAdd-data-id"}
        theme="dark"
        mode="horizontal"
        onClick={this.#onClick}
        className="header-toolbar-menu"
      >
        {this.props.isAuthenticated && (
          <Menu.Item
            data-testid={"ToolBar-addAdd-data-id"}
            key={"add-ads"}
          >{`Подать объявление`}</Menu.Item>
        )}
      </Menu>
    );
  }
}
const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.auth.isAuth,
});

export default ToolBar;
