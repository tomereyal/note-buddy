import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Button, Menu, Typography, Tag, Affix, Modal } from "antd";
import { SettingOutlined, SoundOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editPost } from "../../../../_actions/post_actions";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import { Tooltip } from "antd";
import ChildPostForm from "../ChildPostForm";

export default function PostHeader(props) {
  const { post } = props;

  const { name, titleColor, titleBgc, titleFont } = post;
  const initTitle = {
    text: name,
    color: titleColor,
    bgc: titleBgc,
    fontStyle: titleFont,
  };
  const [title, setTitle] = useState(initTitle);

  useEffect(() => {
    console.log(`initTitle POSTHEADER RECIEVES`, initTitle);
    // console.log(`title POST HEADER RECIEVES`, title);
    if (post) {
      setTitle(initTitle);
    }
  }, [post]);

  const [isComponentModalVisibile, setIsComponentModalVisibile] =
    useState(false);

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
            style={{
              minWidth: "200px",
              minHeight: "42px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TitleEditor
              title={initTitle}
              setTitle={setTitle}
              placeHolder={"Title.."}
              size={1}
            />
            <Tooltip title={"Hear pronunciation"}>
              <Button type="text" icon={<SoundOutlined />}></Button>
            </Tooltip>
          </div>
        }
        onBack={() => {
          window.history.back();
        }}
        tags={<Tag color="blue">Label</Tag>}
        subTitle={`${post.createdAt}`}
        extra={[
          <Button
            onClick={() => {
              setIsComponentModalVisibile(true);
            }}
            key="3"
          >
            + Part
          </Button>,
          <Button key="2">
            <Link to={`/post/${post._id}`}>Edit</Link>
          </Button>,
          <Button icon={<SettingOutlined />} key="1" type="primary" />,
        ]}
        avatar={{
          src: "https://avatars1.githubusercontent.com/u/8186664?s=460&v=4",
        }}
        footer={
          <div style={{ minHeight: "100px" }}>
            ADD DEFINITION SLATE EDITOR ,<span>section navigator</span>
          </div>
        }
      >
        <Modal
          title={"Create a new Component"}
          style={{ top: 20 }}
          visible={isComponentModalVisibile}
          onCancel={() => setIsComponentModalVisibile(false)}
          okButtonProps={{ style: { opacity: 0 } }}
          cancelButtonProps={{ style: { opacity: 0 } }}
        >
          <ChildPostForm
            setModal={setIsComponentModalVisibile}
            parentPost={post}
          ></ChildPostForm>
        </Modal>
      </PageHeader>
    </Affix>
  );
}
