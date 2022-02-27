import "@css/index.scss";

import { SiteHeader } from "@src/components/header/Header";
import AppRouter from "@src/components/router/AppRouter";
import { store } from "@store/store";
import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

class App extends Component {
  render(): React.ReactElement {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Layout className="layout">
            <SiteHeader />

            <Content className="full">
              <AppRouter />
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
