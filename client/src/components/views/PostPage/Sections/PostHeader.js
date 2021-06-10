import React from "react";
import { PageHeader, Button, Menu, Typography, Tag, Affix } from "antd";
// const { Title } = Typography;

export default function PostHeader(props) {
  const { post } = props;
  const HEIGHT_OF_NAVBAR = 70;

  return (
    <Affix offsetTop={HEIGHT_OF_NAVBAR}>
      <PageHeader
        ghost={false}
        title={`${post.writer.name}'s Post`}
        onBack={() => {
          window.history.back();
        }}
        tags={<Tag color="blue">Cleaning</Tag>}
        subTitle={`${post.createdAt}`}
        extra={[
          <Button key="2">Action</Button>,
          <Button key="1" type="primary">
            Action
          </Button>,
        ]}
      ></PageHeader>
    </Affix>
  );
}
