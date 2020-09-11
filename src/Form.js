import React, { useEffect } from "react";
import { Input, Button } from "antd";
import Form from "./KForm";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
};
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
};
const Field=Form.Field;

const DynamicRule = props => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue({username:'default'});
  }, []);

  const onFinish = values => {
    console.log("Success:", values);
  };

  const onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Field
        name="username"
        rules={[
          {
            required: true,
            message: "Please input your name"
          }
        ]}
      >
        <Input placeholder="Please input your name" />
      </Field>
      <Field
        {...formItemLayout}
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password"
          }
        ]}
      >
        <Input placeholder="Please input your password" />
      </Field>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
    </Form>
  );
};

export default DynamicRule;
