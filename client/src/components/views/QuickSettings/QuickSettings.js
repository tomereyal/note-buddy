import React from "react";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Rate,
  Checkbox,
  Row,
  Col,
  Typography,
} from "antd";
import {
  UploadOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { setGeneralConfig } from "../../../_actions/settings_action";

const { Option } = Select;
const { Title } = Typography;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e) => {
  console.log("Upload event:", e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default function QuickSettings() {
  // const settings = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    dispatch(setGeneralConfig(values));
  };
  const settings = {
    language: "en",
    direction: "ltr",
    listsPerSection: 3,
    autoCorrect: true,
  };

  return (
    <div>
      <Form
        name="validate_other"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={settings}
      >
        <Form.Item>
          <Button>
            <a href="/settings">Go to full Settings</a>{" "}
          </Button>
        </Form.Item>
        <Form.Item>
          <Title level={3}> General Settings</Title>
        </Form.Item>

        <Form.Item name="language" label="language">
          <Select placeholder="Please select a country">
            <Option value={"en"}>English</Option>
            <Option value={"he"}>Hebrew</Option>
          </Select>
        </Form.Item>

        <Form.Item name="direction" label="Direction View">
          <Radio.Group>
            <Radio.Button value={"ltr"}>
              <ArrowRightOutlined />
            </Radio.Button>
            <Radio.Button value={"rtl"}>
              <ArrowLeftOutlined />
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Lists Per Section">
          <Form.Item name="listsPerSection" noStyle>
            <InputNumber min={1} max={10} />
          </Form.Item>
          {/* <span className="ant-form-text"> Lists</span> */}
        </Form.Item>

        <Form.Item
          name="autoCorrect"
          label="Auto-correct"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item name="slider" label="Slider">
          <Slider
            marks={{
              0: "A",
              20: "B",
              40: "C",
              60: "D",
              80: "E",
              100: "F",
            }}
          />
        </Form.Item>

        {/* 
        <Form.Item name="checkbox-group" label="Checkbox.Group">
          <Checkbox.Group>
            <Row>
              <Col span={8}>
                <Checkbox value="A" style={{ lineHeight: "32px" }}>
                  A
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="B" style={{ lineHeight: "32px" }} disabled>
                  B
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="C" style={{ lineHeight: "32px" }}>
                  C
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="D" style={{ lineHeight: "32px" }}>
                  D
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="E" style={{ lineHeight: "32px" }}>
                  E
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="F" style={{ lineHeight: "32px" }}>
                  F
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item name="rate" label="Rate">
          <Rate />
        </Form.Item>

        <Form.Item
          name="upload"
          label="Upload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="longgggggggggggggggggggggggggggggggggg"
        >
          <Upload name="logo" action="/upload.do" listType="picture">
            <Button icon={<UploadOutlined />}>Click to upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Dragger">
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger name="files" action="/upload.do">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
*/}
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
