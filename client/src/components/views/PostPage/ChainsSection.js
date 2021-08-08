import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, Tag, Space, Table, Select, Row, Col } from "antd";
import { createChain, fetchChainsByIds } from "../../../api";
import { createPost, editPost } from "../../../_actions/post_actions";
import ContainerWithMenu from "../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "./Sections/SelectWithToggle";
import { deleteChain, editChain, createCardInChain } from "../../../api";
import TitleEditor from "../../editor/TitleEditor/TitleEditor";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import NoteCard from "./Sections/NoteCard";
import CreatePostModule from "../CreatePostModule";
import { createPostInFolder } from "../../../_actions/folder_actions";

addStyles();

export default function ChainsSection({
  post: initialPost = {},
  getPostFromServer,
}) {
  const [post, setPost] = useState(initialPost);
  const { chains, image, _id } = post;
  const dispatch = useDispatch();
  const folders = useSelector((state) => state.folders);
  const posts = useSelector((state) => state.posts);
  const cards = useSelector((state) => state.cards);
  const postsNameAndId = posts.map(({ name, _id }) => {
    return { name, _id };
  });
  const cardsNameAndId = cards
    .map(({ name, _id }) => {
      return { name, _id };
    })
    .filter((card) => card.name);

  console.log(`cards`, cardsNameAndId);

  const folderId = folders.length
    ? folders.find(({ blogs }) => {
        return (
          blogs.findIndex(({ _id }) => {
            console.log(`_id`, _id);
            return post._id === _id;
          }) !== -1
        );
      })._id
    : "";

  useEffect(() => {
    setPost(initialPost);
    console.log(`post from chainsSeciton`, initialPost);
  }, [initialPost]);

  const addNewChain = async () => {
    const variables = { postId: _id };
    const { data } = await createChain(variables);
    const { chain: newChain } = data;
    const editVariables = {
      postId: _id,
      editArr: [{ editType: "chains", editValue: [...chains, newChain] }],
    };
    dispatch(editPost(editVariables)).then((err, suc) => {
      getPostFromServer(_id);
    });
  };
  const deleteChainOnClick = async (chainId) => {
    const data = await deleteChain(chainId);
    getPostFromServer(_id);
  };

  const addNewHead = (chainId, chainHeads) => {
    return async function (newChainHeadId) {
      const variables = {
        id: chainId,
        updates: { heads: [...chainHeads, newChainHeadId] },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const addNewConnector = (chainId, chainConnectors) => {
    return async function (connectorId) {
      const variables = {
        id: chainId,
        updates: { connectors: [...chainConnectors, connectorId] },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const createNewHead = (chainId, chainHeads) => {
    return async function (variablesFromModule) {
      const post = await dispatch(createPostInFolder(variablesFromModule));
      console.log(`post returned from createpost`, post);

      const variables = {
        id: chainId,
        updates: { heads: [...chainHeads.map(({ _id }) => _id), post] },
      };
      console.log(`variables`, variables);
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };

  const addNewOutcome = (chainId, chainOutcomes) => {
    return async function (newChainOutcomeId) {
      const variables = {
        id: chainId,
        updates: { outcomes: [...chainOutcomes, newChainOutcomeId] },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const removeHead = (chainId, chainHeads, headId) => {
    return async function () {
      const variables = {
        id: chainId,
        updates: {
          heads: chainHeads.filter((head) => head._id !== headId),
        },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const removeOutcome = (chainId, chainOutcomes, outcomeId) => {
    return async function () {
      const variables = {
        id: chainId,
        updates: {
          outcomes: chainOutcomes.filter(
            (outcome) => outcome._id !== outcomeId
          ),
        },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const removeConnector = (chainId, chainConnector, connectorId) => {
    return async function () {
      const variables = {
        id: chainId,
        updates: {
          connectors: chainConnector.filter(
            (connector) => connector._id !== connectorId
          ),
        },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };

  const changeChainType = (chainId, type) => {
    return async function () {
      const variables = {
        id: chainId,
        updates: {
          type: type === "uniDirectional" ? "biDirectional" : "uniDirectional",
        },
      };
      console.log(`variables`, variables);
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };

  const createConnector = (chainId) => {
    return async function () {
      const variables = {
        chainId,
        // sectionId,
        // listId: list._id,
        // // order: index,
        // content: [],
        // tags: [],
      };
      const { data } = await createCardInChain(variables);
      const { card } = data;
      console.log(`card`, card);
      getPostFromServer(_id);
    };
  };

  const columns = [
    {
      title: "Heads",
      dataIndex: "heads",
      key: "head",
      render: (heads, row) => (
        <ContainerWithMenu
          key={"heads" + row._id}
          menu={
            <div>
              <SelectWithToggle
                options={postsNameAndId}
                onSelect={addNewHead(row.chainId, heads)}
              />
              <CreatePostModule
                createPostFunction={createNewHead(row.chainId, heads)}
                folderId={folderId}
              />
            </div>
          }
        >
          {heads?.map((head, index) => {
            return (
              <div style={{ position: "relative" }} key={head._id}>
                <ContainerWithMenu
                  key={head._id + index}
                  leftMenu={
                    <Button
                      size="small"
                      shape="circle"
                      onClick={removeHead(row.chainId, heads, head._id)}
                    >
                      X
                    </Button>
                  }
                >
                  <Avatar src={head.image}></Avatar>

                  <TitleEditor
                    isReadOnly={true}
                    title={head.title}
                    name={head.name}
                    style={{ fontSize: "14px" }}
                  />
                </ContainerWithMenu>
              </div>
            );
          })}
        </ContainerWithMenu>
      ),
    },
    {
      title: "From",
      dataIndex: "connectors",
      key: "connectors",
      render: (connectors, row, type) => {
        const arrowLatex =
          type === "uniDirectional"
            ? "\\longrightarrow "
            : "\\longleftrightarrow";
        return (
          <ContainerWithMenu
            key={"connectors" + row._id}
            menu={
              <SelectWithToggle
                options={cardsNameAndId}
                onSelect={addNewConnector(row.chainId, connectors)}
              />
            }
          >
            {connectors.length ? (
              connectors.map((connector, index) => {
                return (
                  <div style={{ position: "relative" }} key={connector._id}>
                    <ContainerWithMenu
                      key={connector._id + index}
                      leftMenu={
                        <Button
                          size="small"
                          shape="circle"
                          onClick={removeConnector(
                            row.chainId,
                            connectors,
                            connector._id
                          )}
                        >
                          X
                        </Button>
                      }
                    >
                      <div style={{ width: "400px" }}>
                        <a
                          onClick={() => {
                            console.log(`connector`, connector);
                          }}
                        >
                          <TitleEditor
                            title={connector.title}
                            isReadOnly={true}
                            darkenBgc={false}
                          ></TitleEditor>
                        </a>
                      </div>
                    </ContainerWithMenu>
                  </div>
                );
              })
            ) : (
              <a onClick={createConnector(row.chainId)}>"create a connector"</a>
            )}
            <Row justify="center">
              <Col>
                <Button
                  size="large"
                  style={{ zIndex: 1 }}
                  onClick={changeChainType(row.chainId, type)}
                >
                  <StaticMathField>{arrowLatex}</StaticMathField>
                </Button>
              </Col>
            </Row>
          </ContainerWithMenu>
        );
      },
    },

    {
      title: "Outcome",
      key: "outcomes",
      dataIndex: "outcomes",
      render: (outcomes, row, index) => (
        <ContainerWithMenu
          key={"outcomes" + row._id}
          menu={
            <SelectWithToggle
              options={postsNameAndId}
              onSelect={addNewOutcome(row.chainId, outcomes)}
            />
          }
        >
          {outcomes.length
            ? outcomes.map((outcome) => {
                return (
                  <div style={{ position: "relative" }} key={outcome._id}>
                    <ContainerWithMenu
                      key={outcome._id}
                      leftMenu={
                        <Button
                          size="small"
                          shape="circle"
                          onClick={removeOutcome(
                            row.chainId,
                            outcomes,
                            outcome._id
                          )}
                        >
                          X
                        </Button>
                      }
                    >
                      <Avatar src={outcome.image}></Avatar>
                      <TitleEditor
                        isReadOnly={true}
                        title={outcome.title}
                        name={outcome.name}
                        style={{ fontSize: "14px" }}
                      />
                    </ContainerWithMenu>
                  </div>
                );
              })
            : "No outcome added.."}
        </ContainerWithMenu>
      ),
    },
    {
      title: "",
      key: "action",
      render: (row) => (
        <Space size="small">
          <a
            onClick={() => {
              const { chainId } = row;
              deleteChainOnClick(chainId);
            }}
          >
            X
          </a>
        </Space>
      ),
    },
  ];

  const data = chains.map((chain, index) => {
    return {
      key: index,
      heads: chain.heads,
      connectors: chain.connectors,
      type: chain.type,
      outcomes: chain.outcomes,
      chainId: chain._id,
    };
  });

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <div style={{ padding: "6px 4px" }}>
        <Button onClick={addNewChain}>
          Add Chain to <Avatar size={20} src={image}></Avatar>
        </Button>
      </div>
    </div>
  );
}
