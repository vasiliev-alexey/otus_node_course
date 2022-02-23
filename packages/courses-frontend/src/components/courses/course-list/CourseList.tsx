import { courseSelector } from "@store/selectors/selectors";
import { getAllCourses } from "@store/slices/courseSlice";
import { Avatar, Card, Col, Row } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CourseList = () => {
  const data = useSelector(courseSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCourses());
  }, []);

  return (
    <>
      <Row gutter={[20, 20]}>
        {data.map((c) => {
          return (
            <Col span={8} key={c.id}>
              <Card
                key={c.id}
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
                  title={c.title}
                  description={`${c.title} от ${c.authorName}`}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};
