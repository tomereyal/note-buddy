import React from "react";
import { PageHeader, Button, Menu, Typography, Tag, Affix } from "antd";
import { SettingOutlined } from "@ant-design/icons";
// const { Title } = Typography;

export default function PostHeader(props) {
  const { post } = props;
  const HEIGHT_OF_NAVBAR = 70;

  return (
    <Affix offsetTop={HEIGHT_OF_NAVBAR}>
      <PageHeader
        ghost={false}
        title={`${post.name}`}
        onBack={() => {
          window.history.back();
        }}
        tags={<Tag color="blue">Cleaning</Tag>}
        subTitle={`${post.createdAt}`}
        extra={[
          <Button key="2">Action</Button>,
          <Button icon={<SettingOutlined />} key="1" type="primary" />,
        ]}
      ></PageHeader>
    </Affix>
  );
}
