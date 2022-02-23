import "@css/index.scss";

import Login from "@src/components/auth/login/Login";
import { LogOut } from "@src/components/auth/logout/LogOut";
import SignUp from "@src/components/auth/signup/SignUp";
import { CourseList } from "@src/components/courses/course-list/CourseList";
import { SiteHeader } from "@src/components/header/Header";
import { store } from "@store/store";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

class App extends Component {
  render(): React.ReactElement {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Layout className="layout">
            <SiteHeader />

            <Content className="full">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/logout" element={<LogOut />} />
                <Route path="/" element={<CourseList />} />
              </Routes>
            </Content>

            <Footer style={{ textAlign: "center" }} className="footer-2">
              Мои курсы
            </Footer>
          </Layout>
        </Provider>
      </BrowserRouter>
    );
  }
}

export default App;
