import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Button, Menu, Typography, Tag, Affix } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setPostTitle } from "../../../../_actions/post_actions";
const { Text } = Typography;

export default function PostHeader(props) {
  const { post } = props;
  const [editableStr, setEditableStr] = useState(props.post.name);
  const dispatch = useDispatch();
  const HEIGHT_OF_NAVBAR = 70;

  useEffect(() => {
    setEditableStr(props.post.name);
  }, [props]);

  const handlePostTitle = (newTitle) => {
    const variables = {
      postId: props.post._id,
      newTitle,
    };
    console.log(`variables`, variables);
    dispatch(setPostTitle(variables));
  };

  return (
    <Affix offsetTop={HEIGHT_OF_NAVBAR}>
      <PageHeader
        ghost={false}
        title={
          <Text
            style={{ fontSize: "25px", minWidth: "150px", color: "black" }}
            editable={{
              onChange: (e) => {
                setEditableStr(e);
                handlePostTitle(e);
              },
            }}
          >
            {editableStr}
          </Text>
        }
        onBack={() => {
          window.history.back();
        }}
        tags={<Tag color="blue">Cleaning</Tag>}
        subTitle={`${post.createdAt}`}
        extra={[
          <Button key="2">
            <Link to={`/post/${post._id}`}>Edit</Link>
          </Button>,
          <Button icon={<SettingOutlined />} key="1" type="primary" />,
        ]}
        // footer={
        //   <div style={{ minHeight: "150px" }}>
        //     <span>Image?</span>
        //     <br />
        //     <span>Description</span>
        //     <span>section navigator</span>
        //   </div>
        // }
      ></PageHeader>
    </Affix>
  );
}
