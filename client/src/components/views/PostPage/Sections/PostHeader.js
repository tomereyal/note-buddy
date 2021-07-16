import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Button, Menu, Typography, Tag, Affix } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editPost } from "../../../../_actions/post_actions";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
const { Text } = Typography;

export default function PostHeader(props) {
  const { post } = props;
  const { name, titleColor, titleBgc, titleFont } = post;
  const [title, setTitle] = useState({
    text: name,
    color: titleColor,
    bgc: titleBgc,
    fontStyle: titleFont,
  });

  const dispatch = useDispatch();
  const HEIGHT_OF_NAVBAR = 70;

  const savePost = () => {
    const variables = {
      postId: props.post._id,
      editArr: [
        { editType: "name", editValue: title.text },
        { editType: "titleColor", editValue: title.color },
        { editType: "titleBgc", editValue: title.bgc },
        { editType: "titleFont", editValue: title.fontStyle },
      ],
    };

    dispatch(editPost(variables));
  };

  return (
    <Affix offsetTop={HEIGHT_OF_NAVBAR}>
      <PageHeader
        ghost={false}
        title={
          <div
            onBlur={savePost}
            style={{ minWidth: "200px", minHeight: "42px" }}
          >
            <TitleEditor
              title={title}
              setTitle={setTitle}
              placeHolder={"Title.."}
              size={1}
            />
          </div>
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
