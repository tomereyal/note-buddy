import React, { useState } from "react";
import { Avatar, Modal, Image, Form, Upload } from "antd";
import { css } from "@emotion/css";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

/**
 * @param {title} title Receives a string with the image label
 * @param {src} src Receives the full URL of the image wanted to display in avatar.
 * @param {setImage} setImage ?Receives a useState hook, sets parent component's image in avatar
 *  * @returns EditableAvatar
 */

export default function EditableAvatar({
  title,
  src,
  setImage,
  ...AvatarProps
}) {
  const [uploadedImage, setUploadedImage] = useState(src);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (!setImage) return;
    setImage(uploadedImage);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const normFile = (e) => {
    console.log("Upload event:", e);

    if (e.file.response) {
      console.log(`uploaded:`, e.file.response.url);
      setUploadedImage(e.file.response.url);
    }
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  return (
    <>
      <Avatar
        src={src}
        {...AvatarProps}
        onClick={showModal}
        className={css`
          &:hover {
            cursor: pointer;
          }
        `}
      ></Avatar>
      <Modal
        title={title}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Image
          //http://localhost:5000/uploads/1626792684448_cover4.jpg
          src={uploadedImage}
          preview={false}
          alt={title}
        ></Image>
        <Form name="validate_other" {...formItemLayout} onFinish={onFinish}>
          {" "}
          <Form.Item label="Change Image">
            <Form.Item
              name="dragger"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                name="file"
                action="/api/blog/uploadfiles"
                maxCount={1}
              >
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
        </Form>
      </Modal>
    </>
  );
}