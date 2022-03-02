import { UploadOutlined } from "@ant-design/icons";
import { createNewCourse, getCourseById } from "@store/slices/courseSlice";
import { Button, Form, FormInstance, Input, message, Upload } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { UploadChangeParam } from "antd/lib/upload/interface";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@store/store";
import { courseSelector, coursesSelector } from "@store/selectors/selectors";

const CourseEdit = () => {
  const dispatch = useDispatch();
  const formRef = React.createRef<FormInstance>();
  let fileData: UploadFile[];

  let { id } = useParams();

  console.log("id", id);

  useEffect(() => {
    dispatch(getCourseById(id));
  }, [id]);

  const data = useSelector(courseSelector);

  const onFinish = async (values: Record<string, unknown>) => {
    dispatch(
      createNewCourse({
        course: {
          title: values.title.toString(),
          authorName: "ss",
          description: String(values.description),
        },
        file: fileData[0].originFileObj,
      })
    );
  };

  const onFinishFailed = async (errorInfo: unknown) => {
    await message.error(`${errorInfo} file upload failed.`);
  };

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },

    beforeUpload: () => false,
    onChange(info: UploadChangeParam) {
      if (info.file.status !== "uploading") {
        fileData = info.fileList;
      }
      if (info.file.status === "success") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  if (!formRef) {
    formRef.current.setFieldsValue({
      title: data.title,
    });
  }

  return (
    <Form
      name="newCourse"
      ref={formRef}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      initialValues={{
        title: data?.title,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Наименование курса"
        name="title"
        rules={[
          {
            required: true,
            message: "Введите название курса",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Описание курса"
        name="description"
        rules={[
          {
            required: true,
            message: "Введите описание курса",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <Form.Item
        name="file"
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        ,
      </Form.Item>
    </Form>
  );
};

export default CourseEdit;
