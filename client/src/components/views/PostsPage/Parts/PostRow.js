import React from "react";
import { Card, Popconfirm, Avatar, List } from "antd";
import { Draggable } from "react-beautiful-dnd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import TitleEditor from "../../../editor/TitleEditor/TitleEditor";
const { Meta } = List.Item;

export default function PostRow({ post, onRemove, index }) {
  let history = useHistory();
  return (
    <Draggable draggableId={post._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <List.Item
            onDoubleClick={() => {
              history.push(`/post/${post._id}`);
            }}
            actions={[
              <Popconfirm
                placement="bottomLeft"
                title={"Delete Card Permanently"}
                key="delete"
                onConfirm={() => {
                  onRemove();
                }}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined />
              </Popconfirm>,
              <EditOutlined key="edit" />,
              <Link to={`/post/${post._id}`}>
                <EllipsisOutlined key="ellipsis" />
              </Link>,
            ]}
          >
            <Meta
              avatar={<Avatar src={post.image} />}
              title={
                <TitleEditor
                  title={post.title}
                  name={post.name}
                  isReadOnly={true}
                ></TitleEditor>
              }
              description={
                <TitleEditor
                  title={post.description}
                  isReadOnly={true}
                  size={5}
                ></TitleEditor>
              }
            />
          </List.Item>
        </div>
      )}
    </Draggable>
  );
}
