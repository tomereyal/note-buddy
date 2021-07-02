import React, { useState } from "react";
import { Typography, Button, Form, message } from "antd";
import axios from "axios";
import { useSelector } from "react-redux";
const { Title } = Typography;

export default function CreatePage(props) {
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const someId = "1";
  const onSubmit = (event) => {
    event.preventDefault();

    // if (user.userData && !user.userData.isAuth) {
    //   return alert("Please Log in first !");
    // }

    const variables = {
      content: content,
      writer: user.userData._id,
    };

    console.log("attemping to post from this route /api/blog/createPost");

    axios.post("/api/blog/createPost", variables).then((response) => {
      if (response.data.success) {
        message.success("Post Created");

        setTimeout(() => {
          props.history.push("/blog");
        }, 2000);
      }
    });
  };

  const onEditorChange = (value) => {
    setContent(value);
  };

  const onFilesChange = (files) => {
    console.log("files changed");
    // setFiles(files);
  };

  return (
    <div>
      <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
        <div style={{ textAlign: "center" }}>
          <Title level={2}>Note</Title>

          <Form onSubmit={onSubmit}>
            <div style={{ textAlign: "center", margin: "2rem" }}>
              <Button
                size="large"
                htmlType="submit"
                className=""
                onClick={onSubmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
