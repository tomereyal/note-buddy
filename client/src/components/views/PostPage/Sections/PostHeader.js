import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
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
  PlusCircleOutlined,
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
      subTitle={` ${DateTime.fromISO(post.createdAt).toFormat(
        "HH:mm dd LLL yyyy"
      )}`}
      extra={[
        <Button key="2">
          <Link to={`/post/${post._id}`}>Edit</Link>
        </Button>,
        <Button icon={<SettingOutlined />} key="1" type="primary" />,
      ]}
      footer={
        <div>
          {/* <span>section navigator</span> */}
          <Button
            onClick={() => {
              setIsComponentModalVisibile(true);
            }}
            key="1"
            icon={
              <img
                height="20px"
                width="20px"
                src={
                  "https:img-premium.flaticon.com/svg/1180/1180929.svg?token=exp=1627428466~hmac=8f028cff04afe241f5501e0885d65b8c"
                }
              />
            }
          >
            Parts
          </Button>
          <Button
            onClick={() => {}}
            key="2"
            icon={
              <img
                height="20px"
                width="20px"
                src={
                  "https://img-premium.flaticon.com/svg/3534/3534076.svg?token=exp=1627468788~hmac=3908e9ef7a96c1961b81758402c60cfc"
                }
              />
            }
          >
            E.g's
          </Button>
          <Button
            onClick={() => {}}
            key="3"
            icon={
              <img
                height="20px"
                width="20px"
                src={
                  "https://img-premium.flaticon.com/svg/2784/2784530.svg?token=exp=1627468531~hmac=bf3960fd6660658841969e0cb9ebfede"
                }
              />
            }
          >
            Q&A
          </Button>
          <Button
            onClick={() => {}}
            key="4"
            icon={
              <img
                height="20px"
                width="20px"
                src={
                  "https://img-premium.flaticon.com/svg/3830/3830031.svg?token=exp=1627469019~hmac=a055410c99ce39b4cc11433a2bf095ba"
                }
              />
            }
          >
            Interactions
          </Button>
        </div>
      }
    >
      <div style={{ marginTop: "0" }} onBlur={savePost}>
        <div style={{ margin: "0 50px" }}>
          <TextEditor
            content={description}
            setContent={setDescription}
            style={{ fontSize: "18px" }}
          ></TextEditor>
        </div>

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
