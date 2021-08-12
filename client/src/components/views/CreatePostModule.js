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
import TitleEditor from "../editor/TitleEditor/TitleEditor";
import { fetchGoogleImage } from "../../api";
import axios from "axios";
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
 * @param {Function} createPostFunction Recieves function with params {name:?, image}
 * @param {ReactComponent} buttonElement Recieves useState hook for modal visibility state.
 */

export default function CreatePostModule({
  createPostFunction,
  buttonElement,
  folderId,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state) => state.user);
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const [name, setName] = useState("");
  const [title, setTitle] = useState([]);
  const [conditionTitle, setConditionTitle] = useState([]);
  const [conditionName, setConditionName] = useState("");
  const [image, setImage] = useState("");
  const [googleImages, setGoogleImages] = useState({ name: "", images: [] });
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
    console.log(`title`, title);
    if (!name || !user.userData || !title) {
      return;
    }
    const userId = user.userData._id;

    const postVariables = {
      name: `${name} ${conditionName}`,
      title,
      image,
      writer: userId,
      conditions: conditionTitle,
    };
    console.log(`postVariables`, postVariables);
    if (folderId) {
      createPostFunction({
        postVariables,
        folderId: folderId || folders[0]?._id,
      });
    } else {
      createPostFunction(postVariables);
    }

    form.resetFields();
    setName("");
    setTitle([]);
    setRandomIcon(fetchedIcons);
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
    // if (!fetchedIcons) {
    //   return;
    // }
    if (!fetchedIcons || fetchedIcons?.length === 0) {
      return setImage("");
    }
    setImage(fetchedIcons[Math.floor(Math.random() * fetchedIcons.length)].svg);
  };

  const ButtonElement = buttonElement ? (
    buttonElement
  ) : (
    <Button>create post</Button>
  );
  return (
    <>
      <span
        onClick={() => {
          setIsModalVisible(true);
        }}
      >
        {ButtonElement}
      </span>
      <Modal
        title="Create New Post  (ctrl n)"
        visible={isModalVisible}
        onCancel={handleCancel}
        okButtonProps={{ style: { visibility: "hidden" } }}
        cancelButtonProps={{ style: { visibility: "hidden" } }}
      >
        <div
          onBlur={(e) => {
            checkForDuplicates(name);
          }}
        >
          <TitleEditor
            setTitle={setTitle}
            title={title}
            name={name}
            placeHolder={"Write name here.."}
            setName={setName}
          ></TitleEditor>
        </div>
        <TitleEditor
          title={conditionTitle}
          setTitle={setConditionTitle}
          name={conditionName}
          setName={setConditionName}
          placeHolder={"Write conditions here.."}
        ></TitleEditor>
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
          {/* <Form.Item
            name="name"
            label={`Name:`}
            rules={[
              {
                required: true,
              },
            ]}
          >
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
          </Form.Item> */}
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
