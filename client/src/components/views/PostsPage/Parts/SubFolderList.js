import React from "react";
import { useDispatch } from "react-redux";
import { Droppable } from "react-beautiful-dnd";
import { List, Row, Col, Button, Popconfirm } from "antd";
import PostRow from "./PostRow";
import CreatePostModule from "../../CreatePostModule";
import { PlusSquareTwoTone } from "@ant-design/icons";
import {
  createPostInFolder,
  editFolder,
} from "../../../../_actions/folder_actions";
import { createPost, getPosts } from "../../../../_actions/post_actions";
import ContainerWithMenu from "../../BasicComponents/ContainerWithMenu";
export default function SubFolderList({ subFolder, folderId }) {
  const dispatch = useDispatch();

  const addPost = async (variables) => {
    if (!subFolder) return;
    const newPost = await dispatch(createPost(variables.postVariables));
    dispatch(
      editFolder({
        query: { _id: folderId, "subFolders._id": subFolder._id },
        updates: { $push: { "subFolders.$.blogs": newPost } },
      })
    );
  };
  const removePost = (postId) => {
    return async () => {
      if (!subFolder) return;
      dispatch(
        editFolder({
          query: { _id: folderId, "subFolders._id": subFolder._id },
          updates: { $pull: { "subFolders.$.blogs": postId } },
        })
      );
    };
  };
  const removeSubFolder = () => {
    const variables = {
      query: { _id: folderId },
      updates: { $pull: { subFolders: { _id: subFolder._id } } },
    };
    console.log(`variables`, variables);
    dispatch(editFolder(variables));
  };

  const header = (
    <ContainerWithMenu
      menu={
        <Popconfirm
          onConfirm={() => {
            removeSubFolder();
          }}
        >
          <Button>X</Button>
        </Popconfirm>
      }
    >
      <Row justify="center">
        <Col>{subFolder.name}</Col>
      </Row>
    </ContainerWithMenu>
  );

  const footer = (
    <Row justify="center">
      <Col>
        <CreatePostModule
          folderId={subFolder._id}
          buttonElement={
            <Button size={"large"} icon={<PlusSquareTwoTone />}>
              Add Post
            </Button>
          }
          createPostFunction={addPost}
        />
      </Col>
    </Row>
  );

  //DRAG AND DROP=================

  return (
    <List
      size="small"
      header={header}
      style={{ minHeight: "300px", minWidth: "180px" }}
      footer={footer}
    >
      <Droppable droppableId={subFolder._id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {subFolder.blogs?.map((post, index) => {
              if (post)
                return (
                  <PostRow
                    key={post._id}
                    post={post}
                    onRemove={removePost(post._id)}
                    index={index}
                  />
                );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </List>
  );
}
