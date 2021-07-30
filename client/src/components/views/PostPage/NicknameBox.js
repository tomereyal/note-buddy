import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Button, Form, Input } from "antd";
import { editPost } from "../../../_actions/post_actions";

export default function NicknameBox({ post }) {
  const [isFormShown, setIsFormShown] = useState(false);
  const [name, setName] = useState("");
  const posts = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const toggleForm = () => {
    setIsFormShown((prev) => {
      return prev ? false : true;
    });
  };

  const isNameValid = () => {
    //name is valid if it doesnt already exist
    const existingNameIndex = posts.findIndex(
      ({ name: postName, nicknames }) => {
        postName === name || nicknames.includes(name);
      }
    );

    return existingNameIndex === -1 ? true : false;
  };

  const addNickname = () => {
    const variables = {
      postId: post._id,
      editArr: [
        { editType: "nicknames", editValue: [...post.nicknames, name] },
      ],
    };

    dispatch(editPost(variables));
  };

  const removeNickname = (nicknameToRemove) => {
    const filteredNicknames = post.nicknames.filter((nickname) => {
      console.log(`nickname`, nickname, nicknameToRemove);

      return nickname !== nicknameToRemove;
    });

    const variables = {
      postId: post._id,
      editArr: [{ editType: "nicknames", editValue: filteredNicknames }],
    };

    dispatch(editPost(variables));
  };
  return (
    <div style={{ overflowX: "hidden" }}>
      <div
        style={{
          display: "inline-block",
          alignItems: "center",
          width: "100px",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {post.nicknames.map((nickname) => {
          return (
            <Tag
              color="blue"
              key={nickname}
              closable
              onClose={() => {
                removeNickname(nickname);
              }}
            >
              {nickname}
            </Tag>
          );
        })}
      </div>

      {isFormShown ? (
        <span>
          <Input
            style={{ width: "130px" }}
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></Input>
          <Button
            onClick={() => {
              if (!isNameValid()) {
                alert("name already exists");
                return;
              }
              addNickname();
              toggleForm();
            }}
          >
            Add
          </Button>
          <Button
            onClick={() => {
              toggleForm();
            }}
          >
            X
          </Button>
        </span>
      ) : (
        <Button onClick={toggleForm}>add Nick</Button>
      )}
    </div>
  );
}
