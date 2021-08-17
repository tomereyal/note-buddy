import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import { getFolders, addSubFolder } from "../../../_actions/folder_actions";
import { Button, Layout, Col, Typography, Row, Input } from "antd";
import { useParams } from "react-router-dom";
import SubFolderList from "./Parts/SubFolderList";
import { editFolder } from "../../../_actions/folder_actions";

const { Content } = Layout;
const { Title } = Typography;

export default function PostsPage(props) {
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  const { folderId } = useParams();

  const initFolder = folders.find((folder) => {
    return folder._id == folderId;
  });

  const [folder, setFolder] = useState(initFolder ? initFolder : null);
  const subFolders = folder?.subFolders;
  const dispatch = useDispatch();
  // const folderId = props.folder._id;

  useEffect(() => {
    if (!folders) {
      dispatch(getFolders());
    }
    if (folders.length >= 1 && !folder) {
      const folder_ = folders.find((folder) => {
        return folder._id == folderId;
      });
      setFolder(folder_);
    }
    if (folders.length >= 1 && folder) {
      const folder_ = folders.find((folder) => {
        return folder._id == folderId;
      });
      setFolder(folder_);
    }
  }, [folderId, folders, dispatch, posts]);

  const addNewSubFolder = (name) => {
    const variables = { id: folder._id, updates: { name } };
    console.log(`variables`, variables);
    dispatch(addSubFolder(variables));
  };

  //DRAG AND DROP =========
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const { droppableId: dId, index: dIndex } = destination;
    const { droppableId: sId, index: sIndex } = source;

    if (!isPositionChanged({ dId, sId, dIndex, sIndex })) return;

    const startSubFolderIndex = subFolders.findIndex((sb) => sb._id === sId);
    const startSubFolder = subFolders[startSubFolderIndex];
    const endSubFolderIndex = subFolders.findIndex((sb) => sb._id === dId);
    const endSubFolder = subFolders[endSubFolderIndex];
    const post = startSubFolder.blogs.find((post) => post._id === draggableId);

    if (startSubFolder === endSubFolder) {
      const newBlogsArr = Array.from(startSubFolder.blogs);
      newBlogsArr.splice(sIndex, 1);
      newBlogsArr.splice(dIndex, 0, post);
      const newSubFolder = { ...startSubFolder, blogs: newBlogsArr };
      const newSubFoldersArr = subFolders.map((sf) =>
        sf._id === newSubFolder._id ? newSubFolder : sf
      );
      console.log(`newSubFoldersArr`, newSubFoldersArr);

      setFolder((prev) => {
        return { ...prev, subFolders: newSubFoldersArr };
      });
      dispatch(
        editFolder({
          query: { _id: folder._id },
          updates: { subFolders: newSubFoldersArr },
        })
      );
      return;
    }

    //take away post from starting subFolder
    const sourceBlogs = Array.from(startSubFolder.blogs);
    sourceBlogs.splice(sIndex, 1);
    const newStart = { ...startSubFolder, blogs: sourceBlogs };

    //add post to ending subFolder
    const destinationBlogs = Array.from(endSubFolder.blogs);
    destinationBlogs.splice(dIndex, 0, post);
    const newEnd = { ...endSubFolder, blogs: destinationBlogs };

    const newSubFolders = subFolders.map((sb, index) => {
      if (index === startSubFolderIndex) return newStart;
      else if (index === endSubFolderIndex) return newEnd;
      else return sb;
    });
    console.log(`newSubFolders`, newSubFolders);

    setFolder((prev) => {
      return { ...prev, subFolders: newSubFolders };
    });
    dispatch(
      editFolder({
        query: { _id: folder._id },
        updates: { subFolders: newSubFolders },
      })
    );
    return;
  };

  const isPositionChanged = ({ dId, sId, dIndex, sIndex }) => {
    return !(dId === sId && dIndex === sIndex);
  };

  return (
    folder && (
      <Layout>
        <Content>
          <div style={{ width: "80%", margin: "1rem auto" }}>
            <Title level={2}>{folder.name}</Title>
            <DragDropContext onDragEnd={onDragEnd}>
              <div>
                {folder.subFolders?.map((subFolder, i) => {
                  return (
                    <SubFolderList
                      key={subFolder._id + i}
                      subFolder={subFolder}
                      folderId={folder._id}
                    />
                  );
                })}
              </div>
            </DragDropContext>
            <Row justify="space-around" gutter={[32, 16]}>
              <Col>
                <Input
                  placeholder={"create a new subfolder"}
                  onPressEnter={(e) => {
                    const name = e.target.value;
                    if (!name) return;
                    addNewSubFolder(name);
                  }}
                ></Input>
              </Col>
            </Row>
          </div>
          <Row justify="end">
            <Col style={{ margin: "10px" }}>
              <Button
                onClick={() => {
                  console.log(`cards`);
                  props.history.push(`/folder/cards/${folder._id}`);
                }}
              >
                checkout cards
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    )
  );
}
