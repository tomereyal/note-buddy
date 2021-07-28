import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Avatar, Button, Row, Col } from "antd";
import { editPost } from "../../../../_actions/post_actions";
import ChildPostForm from "./ChildPostForm";
import { EditOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
const { Meta } = Card;

export default function PostComponent({ parentPost, component }) {
  const [isComponentModalVisibile, setIsComponentModalVisibile] =
    useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const removeComponent = () => {
    const parentPostId = parentPost._id;
    const componentId = component._id;
    const componentIndex = parentPost.components.findIndex((comp) => {
      return comp._id === component._id;
    });
    const newComponentsArr = parentPost.components.map((post) => post._id);
    newComponentsArr.splice(componentIndex, 1);
    //update parent post
    dispatch(
      editPost({
        postId: parentPostId,
        editArr: [{ editType: "components", editValue: newComponentsArr }],
      })
    );
    //update component post
    const roleIndex = component.roles.findIndex((role) => {
      return role.inPostId === parentPostId;
    });
    const newRolesArr = component.roles.concat();
    newRolesArr.splice(roleIndex, 1);
    dispatch(
      editPost({
        postId: componentId,
        editArr: [{ editType: "roles", editValue: newRolesArr }],
      })
    );
  };

  return (
    <Card
      onDoubleClick={() => {
        console.log(`component`, component);
        history.push(`/post/${component._id}`);
      }}
      hoverable
      onMouseEnter={() => {
        setIsCardHovered(true);
      }}
      onMouseLeave={() => {
        setIsCardHovered(false);
      }}
    >
      <Row
        justify="space-between"
        style={{
          opacity: isCardHovered ? 100 : 0,
          position: "absolute",
          right: "3px",
          left: "3px",
          top: "-2px",
          transition: "opacity linear 0.2s",
        }}
      >
        <Col>
          <Button
            type="text"
            onClick={() => {
              setIsComponentModalVisibile(true);
            }}
            icon={<EditOutlined></EditOutlined>}
          ></Button>
        </Col>
        <Col>
          <Button type="text" onClick={removeComponent}>
            X
          </Button>
        </Col>
      </Row>
      <Meta
        avatar={<Avatar src={component.image} size={60}></Avatar>}
        title={component.name}
        description={
          component.roles.find(({ inPostId }) => {
            return inPostId === parentPost._id;
          }).description || "no description"
        }
      />
      <ChildPostForm
        isComponentModalVisibile={isComponentModalVisibile}
        setIsComponentModalVisibile={setIsComponentModalVisibile}
        parentPost={parentPost}
        componentToEdit={component}
      ></ChildPostForm>
    </Card>
  );
}
