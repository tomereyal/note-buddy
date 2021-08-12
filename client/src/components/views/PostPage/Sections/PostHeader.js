import React, { useState } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import { PageHeader, Button } from "antd";
import { SettingOutlined, SoundOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { editPost } from "../../../../_actions/post_actions";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import TextEditor from "../../../editor/TextEditor";
import { Tooltip } from "antd";
import EditableAvatar from "../../BasicComponents/EditableAvatar";
import NicknameBox from "../NicknameBox";

export default function PostHeader(props) {
  const { post } = props;

  const {
    name: initialName,
    title: initialTitle,
    image: initialImage,
    description: initialDescription,
    conditions: initialConditions,
  } = post;

  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [image, setImage] = useState(initialImage);
  const [description, setDescription] = useState(initialDescription);
  const [conditionTitle, setConditionTitle] = useState(initialConditions);
  const [conditionName, setConditionName] = useState("");

  const dispatch = useDispatch();
  const HEIGHT_OF_NAVBAR = 70;

  const savePost = () => {
    const variables = {
      postId: props.post._id,
      editArr: [
        { editType: "name", editValue: `${name} ${conditionName}` },
        { editType: "title", editValue: title },
        { editType: "image", editValue: image },
        { editType: "description", editValue: description },
        { editType: "conditions", editValue: conditionTitle },
      ],
    };
    console.log(`description`, description);
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 8px",
            }}
          >
            <TitleEditor
              name={name}
              setName={setName}
              title={title}
              setTitle={setTitle}
              placeHolder={"Title.."}
              size={1}
            />
            <div style={{ width: "200px" }}>
              <TitleEditor
                title={conditionTitle}
                setTitle={setConditionTitle}
                name={conditionName}
                setName={setConditionName}
                placeHolder={"Write conditions here.."}
                color={"red"}
                size={5}
              ></TitleEditor>
            </div>
          </div>

          <Tooltip title={"Hear pronunciation"}>
            <Button type="text" icon={<SoundOutlined />}></Button>
          </Tooltip>
        </div>
      }
      onBack={() => {
        window.history.back();
      }}
      tags={<NicknameBox post={post}></NicknameBox>}
      subTitle={` ${DateTime.fromISO(post.createdAt).toFormat(
        "HH:mm dd LLL yyyy"
      )}`}
      extra={[
        <Button key="2">
          <Link to={`/post/${post._id}`}>Edit</Link>
        </Button>,
        <Button icon={<SettingOutlined />} key="1" type="primary" />,
      ]}
    >
      <div style={{ marginTop: "0" }} onBlur={savePost}>
        <div style={{ margin: "0 50px" }}>
          <TitleEditor
            // name={name}
            // setName={setName}
            title={description}
            setTitle={setDescription}
            placeHolder={"add description.."}
            size={3}
          />
        </div>
      </div>
    </PageHeader>
    // </Affix>
  );
}
