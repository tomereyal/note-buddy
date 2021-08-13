import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Avatar,
  Tag,
  Space,
  Table,
  Select,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  createChain,
  createExampleChain,
  fetchChainsByIds,
} from "../../../api";
import { createPost, editPost } from "../../../_actions/post_actions";
import ContainerWithMenu from "../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "./Sections/SelectWithToggle";
import { deleteChain, editChain, createCardInChain } from "../../../api";
import TitleEditor from "../../editor/TitleEditor/TitleEditor";
import { addStyles, EditableMathField, StaticMathField } from "react-mathquill";
import NoteCard from "./Sections/NoteCard";
import CreatePostModule from "../CreatePostModule";
import { createPostInFolder } from "../../../_actions/folder_actions";
import { useHistory } from "react-router-dom";
import NoteFlow from "./Sections/NoteFlow/NoteFlow";
addStyles();

export default function ChainsSection({
  post: initialPost = {},
  getPostFromServer,
  isExample = false,
}) {
  const [post, setPost] = useState(initialPost);
  const { chains: generalChains, image, _id, examples } = post;
  const chains = isExample ? examples : generalChains;

  const dispatch = useDispatch();
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

  let history = useHistory();

  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  const addNewChain = async () => {
    const variables = { postId: _id };

    const { data } = !isExample
      ? await createChain(variables)
      : await createExampleChain(variables);
    const { chain: newChain } = data;

    const editField = isExample ? "examples" : "chains";
    const editVariables = {
      postId: _id,
      editArr: [{ editType: editField, editValue: [...chains, newChain] }],
    };
    dispatch(editPost(editVariables)).then((err, suc) => {
      getPostFromServer(_id);
    });
  };
  const deleteChainOnClick = async (chainId) => {
    const data = await deleteChain(chainId);
    getPostFromServer(_id);
  };

  //======ROW CELL FUNCTIONS===========================

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
  const addNewConnector = (chainId) => {
    return async function (connectorId) {
      const variables = {
        id: chainId,
        updates: { connectors: connectorId },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const createNewHead = (chainId, chainHeads) => {
    return async function (variablesFromModule) {
      // const post = await dispatch(createPostInFolder(variablesFromModule));
      console.log(`variablesFromModule`, variablesFromModule);
      const post = await dispatch(createPost(variablesFromModule));
      console.log(`post returned from createpost`, post);

      const variables = {
        id: chainId,
        updates: { $push: { heads: post._id } },
      };
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
          $pull: { outcomes: outcomeId },
          // outcomes: chainOutcomes.filter(
          //   (outcome) => outcome._id !== outcomeId
          // ),
        },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const removeConnector = (chainId) => {
    return async function () {
      const variables = {
        id: chainId,
        updates: {
          connector: null,
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
      };
      const { data } = await createCardInChain(variables);
      const { card } = data;
      console.log(`card`, card);
      getPostFromServer(_id);
    };
  };

  // =======ROW CELL RENDER FUNCTIONS ================

  const renderHeads = (heads, row) => (
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
              <div style={{ paddingLeft: "24px", display: "flex" }}>
                <Avatar
                  src={head.image}
                  onClick={() => {
                    history.push(`/post/${head._id}`);
                  }}
                ></Avatar>
                <div>
                  <TitleEditor
                    isReadOnly={true}
                    title={head.title}
                    name={head.name}
                    style={{
                      fontSize: "14px",
                      backgroundColor: "transparent",
                    }}
                  />
                  {head.conditions ? (
                    <TitleEditor
                      isReadOnly={true}
                      title={head.conditions}
                      style={{
                        fontSize: "10px",
                        color: "red",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </ContainerWithMenu>
          </div>
        );
      })}
    </ContainerWithMenu>
  );

  const renderConnector = (connector, row, index) => {
    const arrowLatex =
      row.type === "uniDirectional"
        ? "\\longrightarrow "
        : "\\longleftrightarrow";
    return (
      <ContainerWithMenu
        key={"connector" + row._id}
        menu={
          <SelectWithToggle
            options={cardsNameAndId}
            onSelect={addNewConnector(row.chainId, connector)}
          />
        }
      >
        <Row justify="center">
          <Col>
            {connector ? (
              <div style={{ position: "relative" }} key={connector._id}>
                <ContainerWithMenu
                  key={connector._id + index}
                  leftMenu={
                    <Button
                      size="small"
                      shape="circle"
                      onClick={removeConnector(row.chainId)}
                    >
                      X
                    </Button>
                  }
                >
                  <div style={{ width: "400px" }}>
                    <a>
                      <NoteCard
                        card={connector}
                        simpleStyle={true}
                        isDeletable={false}
                      ></NoteCard>
                    </a>
                  </div>
                </ContainerWithMenu>
              </div>
            ) : (
              <Tooltip title="add card">
                <Button size="small" onClick={createConnector(row.chainId)}>
                  +
                </Button>
              </Tooltip>
            )}
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: "5px" }}>
          <Col>
            <Button
              size="small"
              style={{ zIndex: 1 }}
              onClick={changeChainType(row.chainId, row.type)}
            >
              <StaticMathField>{arrowLatex}</StaticMathField>
            </Button>
          </Col>
        </Row>
      </ContainerWithMenu>
    );
  };

  const renderOutcomes = (outcomes, row, index) => (
    <ContainerWithMenu
      key={"outcomes" + row._id}
      menu={
        !isExample && (
          <SelectWithToggle
            options={postsNameAndId}
            onSelect={addNewOutcome(row.chainId, outcomes)}
          />
        )
      }
    >
      {outcomes.length
        ? outcomes.map((outcome) => {
            return (
              <div style={{ position: "relative" }} key={outcome._id}>
                <ContainerWithMenu
                  key={outcome._id}
                  leftMenu={
                    !isExample && (
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
                    )
                  }
                >
                  <Avatar src={outcome.image}></Avatar>
                  <TitleEditor
                    isReadOnly={true}
                    title={outcome.title}
                    name={outcome.name}
                    style={{
                      fontSize: "14px",
                      backgroundColor: "transparent",
                    }}
                  />
                </ContainerWithMenu>
              </div>
            );
          })
        : "No outcome added.."}
    </ContainerWithMenu>
  );

  const renderActions = (row) => (
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
  );

  const data = chains.map((chain, index) => {
    return {
      key: index,
      heads: chain.heads,
      connector: chain.connector,
      type: chain.type,
      nodes: chain.nodes,
      outcomes: chain.outcomes,
      chainId: chain._id,
    };
  });

  const columns = [
    {
      title: isExample ? "Examples" : "If",
      dataIndex: "heads",
      key: "head",
      render: renderHeads,
    },
    {
      title: "Since",
      dataIndex: "connector",
      key: "connector",
      render: renderConnector,
    },

    {
      title: isExample ? "Is a" : "then",
      key: "outcomes",
      dataIndex: "outcomes",
      render: renderOutcomes,
    },
    {
      title: "",
      key: "action",
      render: renderActions,
    },
  ];

  const expandable = (chain) => {
    const { connector } = chain;
    console.log(`chain`, chain);
    return <NoteFlow parentContainer={chain} cards={chain.nodes}></NoteFlow>;
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={{
          expandedRowRender: expandable,
          rowExpandable: (chain) => chain.connector,
        }}
      />
      <div style={{ padding: "6px 4px" }}>
        <Row justify="center">
          <Col>
            <Button onClick={addNewChain}>
              Add Chain to <Avatar size={20} src={image}></Avatar>
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
