import "@css/index.scss";

import { SiteHeader } from "@src/components/header/Header";
import { Avatar, Card, Col, Layout, Row } from "antd";
import Meta from "antd/es/card/Meta";
import { Content, Footer } from "antd/es/layout/layout";
import React, { Component } from "react";

class App extends Component {
  render(): React.ReactElement {
    return (
      <Layout className="layout">
        <SiteHeader userName={"s"} isAuthenticated={true} />

        <Content className="full">
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[20, 20]} className={"row"}>
            {" "}
          </Row>
          <Row gutter={[20, 20]} justify={"center"} align={"middle"}>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                bordered={true}
                style={{ width: "25vw" }}
                cover={
                  <img
                    alt="example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                  />
                }
              >
                <Meta
                  avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                  title="Card title"
                  description="This is the description"
                />
              </Card>
            </Col>
          </Row>
        </Content>

        <Footer style={{ textAlign: "center" }} className="footer-2">
          Мои курсы
        </Footer>
      </Layout>
    );
  }
}

export default App;
