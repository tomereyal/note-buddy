import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Input,
  AutoComplete,
  Tooltip,
  Upload,
  Image,
  message,
} from "antd";
import {
  UserOutlined,
  InfoCircleOutlined,
  InboxOutlined,
  GoogleCircleFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostToFolder,
  createPostInFolder,
} from "../../_actions/folder_actions";
import { createPost, getPosts } from "../../_actions/post_actions";
import { fetchGoogleImage } from "../../api";
import axios from "axios";
import { set } from "mongoose";

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

/**
 * @param {isModalVisible} boolean Recieves the visibility state | Default : false.
 * @param {setIsModalVisible} function Recieves useState hook for modal visibility state.
 */

export default function CreatePostModule({
  isModalVisible,
  setIsModalVisible,
  folder,
}) {
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [googleImages, setGoogleImages] = useState({ name: "", images: [] });
  const [writer, setWriter] = useState(user.userData._id);
  const [fetchedIcons, setFetchedIcons] = useState([]);
  const dispatch = useDispatch();
  const postNames = posts.map((post) => {
    if (!post) {
      return;
    }
    return { label: post.name, value: post.name };
  });

  //external api calls

  const searchGoogleImages = async () => {
    if (!name) return;

    if (!googleImages.name || googleImages.name !== name) {
      const data = await fetchGoogleImage(name, 1, 20);
      setGoogleImages({ name: name, images: data });
      setImage(data[getRandomInt(data.length)]);
      return;
    }

    setImage(googleImages.images[getRandomInt(googleImages.images.length)]);
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  //form

  const [form] = Form.useForm();
  const onFormFinish = async (formValues) => {
    addPost(formValues);
    form.resetFields();
    setIsModalVisible(false);
  };

  const onFormReset = () => {
    form.resetFields();
  };

  const normFile = (e) => {
    console.log("Upload event:", e);

    if (e.file.response) {
      console.log(`uploaded:`, e.file.response.url);
      setImage(e.file.response.url);
    }
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const addPost = async ({ name }) => {
    console.log(`name`, name);
    const postVariables = {
      writer,
      image,
      name,
    };

    if (folder) {
      dispatch(createPostInFolder({ postVariables, folderId: folder._id }));
      dispatch(getPosts());
      return;
    }

    if (!folder) {
      dispatch(createPost(postVariables));
    }
  };

  const checkForDuplicates = (value) => {
    const postIndex = posts.findIndex((post) => {
      return post.name === value;
    });

    if (postIndex > -1) {
      message.error("Please rename post, this post name is taken.");
    }
  };

  //module

  const handleOk = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (fetchedIcons.length === 0) {
      getIconsFromDB();
    }
  }, []);

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

  return (
    <>
      <Modal
        title="Create New Post  (ctrl n)"
        visible={isModalVisible}
        onCancel={handleCancel}
        okButtonProps={{ style: { visibility: "hidden" } }}
        cancelButtonProps={{ style: { visibility: "hidden" } }}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFormFinish}
        >
          <Image preview={false} src={image} height={200}></Image>
          <Button
            onClick={() => {
              searchGoogleImages();
            }}
            icon={<GoogleCircleFilled />}
          ></Button>
          <Form.Item
            name="name"
            label={`Name:`}
            rules={[
              {
                required: true,
              },
            ]}
          >
            {/* <AutoComplete
              options={postOptions}
              style={{ width: 200 }}
              onSelect={onNameSelect}
              onSearch={onNameSearch}
            > */}
            <Input
              placeholder="name:"
              prefix={<UserOutlined className="site-form-item-icon" />}
              suffix={
                <Tooltip title={`Enter new post's name..`}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              }
              onChange={(e) => {
                setName(e.target.value);
              }}
              onBlur={(e) => {
                checkForDuplicates(e.target.value);
              }}
            />
            {/* </AutoComplete> */}
          </Form.Item>
          <Form.Item
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger
              name="file"
              action="/api/blog/uploadfiles"
              maxCount={1}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload.
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onFormReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
