import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Menu } from "antd";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { deletePostFromFolder } from "../../../../_actions/folder_actions";
import { deletePost } from "../../../../_actions/post_actions";
import { useRouteMatch } from "react-router-dom";

export default function BlogSubmenu(props) {
  const { blog, folderId, index, style } = props;
  const [title, setTitle] = useState(blog.title);
  const [name, setName] = useState(blog.name);
  const dispatch = useDispatch();
  let { path, url } = useRouteMatch();

  return (
    <div
      key={`subsub${blog._id}`}
      onClick={() => {
        props.history.push(`${url}/post/${blog._id}`);
      }}
      // icon={<EditOutlined onClick={() => {}} />}
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "100%",
        ...style,
      }}
    >
      <TitleEditor
        title={title}
        setTitle={setTitle}
        name={name}
        setName={setName}
        size={5}
        isReadOnly={true}
        style={{
          height: "100%",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      {/* 
      <DeleteOutlined
        style={{ zindex: "5", color: "red" }}
        onClick={(e) => {
          // e.preventDefault();

          const variables = {
            postId: blog._id,
            folderId,
          };
          dispatch(deletePostFromFolder(variables));
          dispatch(deletePost(blog._id));
        }}
      /> */}
    </div>
  );
}
