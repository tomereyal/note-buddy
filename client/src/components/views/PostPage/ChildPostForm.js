import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  Avatar,
  Form,
  Input,
  Button,
  Select,
  AutoComplete,
  Tooltip,
} from "antd";
import { UserOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { createPost, editPost } from "../../../_actions/post_actions";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

export default function ChildPostForm({ setModal, parentPost }) {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const posts = useSelector((state) => state.posts);
  const postNames = posts.map((post) => {
    if (!post) {
      return;
    }
    return { label: post.name, value: post.name };
  });

  const [postOptions, setPostOptions] = useState(postNames);
  //NEW POST STATE----------------
  const [image, setImage] = useState("");
  const [childPostId, setChildPostId] = useState("");
  //-------------------------------
  const [fetchedIcons, setFetchedIcons] = useState([]);

  const onNameSearch = (searchText) => {
    setPostOptions(
      !searchText
        ? postNames.splice(0, 10)
        : postNames.filter(({ label }) => {
            return label.toLowerCase().includes(searchText);
          })
    );
  };
  const onNameSelect = (data) => {
    const existingChildPost = posts.find(
      ({ name }) => name.toLowerCase() === data.toLowerCase()
    );
    if (existingChildPost) {
      setImage(existingChildPost.image);
    } else {
      setImage(null);
    }
  };

  async function getIconsFromDB() {
    const { data } = await axios.get("/api/external/fetchIconsInDb");
    const icons = data.doc.icons;
    setFetchedIcons(icons);
    setRandomIcon(icons);
  }
  const setRandomIcon = (fetchedIcons) => {
    if (fetchedIcons.length === 0) {
      return setImage("");
    }
    setImage(fetchedIcons[Math.floor(Math.random() * fetchedIcons.length)].svg);
  };
  useEffect(() => {
    if (fetchedIcons.length === 0) {
      getIconsFromDB();
    }
    console.log(`posts`, posts);
  }, []);

  const onFinish = async (formValues) => {
    console.log(formValues);
    const { roleDescription, name } = formValues;
    const existingChildPost = posts.find(
      ({ name: postName }) => postName.toLowerCase() === name.toLowerCase()
    );
    //if childPost.id
    if (existingChildPost) {
      dispatch(
        editPost({
          postId: existingChildPost._id,
          editArr: [
            {
              editType: "roles",
              editValue: [
                ...existingChildPost.roles,
                {
                  inPostName: parentPost.name,
                  inPostId: parentPost._id,
                  description: roleDescription,
                },
              ],
            },
          ],
        })
      );
    } else {
      console.log(`image`, image);
      var newPost = await dispatch(
        createPost({
          name,
          writer: parentPost.writer,
          image,
          roles: [
            {
              inPostName: parentPost.name,
              inPostId: parentPost._id,
              description: roleDescription,
            },
          ],
        })
      );
      console.log(`newPost`, newPost);
    }

    //now edit parent post's components:
    const childId = existingChildPost ? existingChildPost._id : newPost;
    console.log(`childId`, childId);
    dispatch(
      editPost({
        postId: parentPost._id,
        editArr: [
          {
            editType: "components",
            editValue: [...parentPost.components, childId],
          },
        ],
      })
    );
    setModal(false);
  };

  const onReset = () => {
    form.resetFields();
  };
  return (
    <div>
      <Avatar
        src={image}
        size={140}
        onClick={() => {
          setRandomIcon(fetchedIcons);
        }}
      ></Avatar>

      <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
        <Form.Item
          name="name"
          label={`Name of ${parentPost.name}'s part`}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <AutoComplete
            options={postOptions}
            style={{ width: 200 }}
            onSelect={onNameSelect}
            onSearch={onNameSearch}
          >
            <Input
              placeholder="name:"
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title={`Enter ${parentPost.name} component's name..`}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
            />
          </AutoComplete>
        </Form.Item>
        <Form.Item
          name="roleDescription"
          label={`Role in ${parentPost.name}`}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
