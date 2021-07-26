import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PageHeader,
  Button,
  Menu,
  Typography,
  Tag,
  Affix,
  Modal,
  Tabs,
} from "antd";
import {
  SettingOutlined,
  SoundOutlined,
  AppleOutlined,
  AndroidOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editPost } from "../../../../_actions/post_actions";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import TextEditor from "../../../editor/TextEditor";
import { Tooltip } from "antd";
import ChildPostForm from "./ChildPostForm";
import Avatar from "antd/lib/avatar/avatar";
import EditableAvatar from "../../BasicComponents/EditableAvatar";

export default function PostHeader(props) {
  const { post } = props;

  const {
    name: initialName,
    title: initialTitle,
    image: initialImage,
    description: initialDescription,
  } = post;
  // const initTitle = {
  //   text: name,
  //   color: titleColor,
  //   bgc: titleBgc,
  //   fontStyle: titleFont,
  // };
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [image, setImage] = useState(initialImage);
  const [description, setDescription] = useState(initialDescription);

  const [isComponentModalVisibile, setIsComponentModalVisibile] =
    useState(false);

  const dispatch = useDispatch();
  const HEIGHT_OF_NAVBAR = 70;

  const savePost = () => {
    const variables = {
      postId: props.post._id,
      editArr: [
        { editType: "name", editValue: name },
        { editType: "title", editValue: title },
        { editType: "image", editValue: image },
        { editType: "description", editValue: description },
      ],
    };

    dispatch(editPost(variables));
  };

  return (
    // <Affix offsetTop={HEIGHT_OF_NAVBAR}>
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
          <EditableAvatar
            title={post.name}
            size={50}
            src={image}
            setImage={setImage}
          ></EditableAvatar>
          <TitleEditor
            name={name}
            setName={setName}
            title={title}
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
        <Button key="2">
          <Link to={`/post/${post._id}`}>Edit</Link>
        </Button>,
        <Button icon={<SettingOutlined />} key="1" type="primary" />,
      ]}
      footer={
        <div>
          <span>section navigator</span>
          <Button
            onClick={() => {
              setIsComponentModalVisibile(true);
            }}
            key="3"
          >
            Add C
          </Button>
          <Button onClick={() => {}} key="3">
            Add Ex
          </Button>
          <Button onClick={() => {}} key="3">
            Add Que
          </Button>
        </div>
      }
    >
      <div onBlur={savePost}>
        <TextEditor
          content={description}
          setContent={setDescription}
        ></TextEditor>

        <ChildPostForm
          isComponentModalVisibile={isComponentModalVisibile}
          setIsComponentModalVisibile={setIsComponentModalVisibile}
          parentPost={post}
        ></ChildPostForm>
      </div>
    </PageHeader>
    // </Affix>
  );
}
