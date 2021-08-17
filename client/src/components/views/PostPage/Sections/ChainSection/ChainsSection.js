import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Avatar,
  Space,
  Table,
  Row,
  Col,
  Tooltip,
  Popconfirm,
} from "antd";
import { createChain, createExampleChain } from "../../../../../api";
import { createPost, editPost } from "../../../../../_actions/post_actions";
import ContainerWithMenu from "../../../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "../SelectWithToggle";
import { deleteChain, editChain, createCardInChain } from "../../../../../api";
import TitleEditor from "../../../../editor/TitleEditor/TitleEditor";
import { addStyles, StaticMathField } from "react-mathquill";
import NoteCard from "../NoteCard";
import CreatePostModule from "../../../CreatePostModule";
import { useHistory } from "react-router-dom";
import NoteFlow from "../NoteFlow/NoteFlow";
import HeadColumn from "./Parts/HeadColumn";
import ConnectorColumn from "./Parts/ConnectorColumn";
import OutcomeColumn from "./Parts/OutcomeColumn";
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

  // const [data, setData] = useState(initialData);

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
        updates: { connector: connectorId },
      };
      const { data } = await editChain(variables);
      getPostFromServer(_id);
    };
  };
  const createNewHead = (chainId) => {
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

  const createNewOutcome = (chainId) => {
    return async function (variablesFromModule) {
      // const post = await dispatch(createPostInFolder(variablesFromModule));
      console.log(`variablesFromModule`, variablesFromModule);
      const post = await dispatch(createPost(variablesFromModule));
      console.log(`post returned from createpost`, post);

      const variables = {
        id: chainId,
        updates: { $push: { outcomes: post._id } },
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

  const renderHeads = (heads, row, index) => (
    <HeadColumn
      heads={heads}
      row={row}
      postsNameAndId={postsNameAndId}
      createNewHead={createNewHead}
      addNewHead={addNewHead}
      removeHead={removeHead}
    />
  );

  const renderConnector = (connector, row) => {
    return (
      <ConnectorColumn
        connector={connector}
        row={row}
        cardsNameAndId={cardsNameAndId}
        addNewConnector={addNewConnector}
        createConnector={createConnector}
        removeConnector={removeConnector}
        changeChainType={changeChainType}
      />
    );
  };

  const renderOutcomes = (outcomes, row) => (
    <OutcomeColumn
      outcomes={outcomes}
      row={row}
      isExample={isExample}
      postsNameAndId={postsNameAndId}
      addNewOutcome={addNewOutcome}
      createNewOutcome={createNewOutcome}
      removeOutcome={removeOutcome}
    />
  );

  const renderActions = (row) => (
    <Space size="small">
      <Popconfirm
        title={"delete chain?"}
        onConfirm={() => {
          const { chainId } = row;
          deleteChainOnClick(chainId);
        }}
      >
        <a>X</a>
      </Popconfirm>
    </Space>
  );

  const columns = [
    {
      title: isExample ? "Examples" : "If",
      dataIndex: "heads",
      key: "head",
      render: renderHeads,
    },
    {
      title: isExample ? "Explanation" : "Since",
      dataIndex: "connector",
      key: "connector",
      width: "50px",
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
        rowKey="index"
        pagination={false}
        expandable={{
          expandedRowRender: expandable,
          rowExpandable: (chain) => chain.connector,
        }}
        // components={{
        //   body: {
        //     wrapper: (props) => {
        //       return <div {...props}></div>;
        //     },
        //     row: ({ className, style, ...restProps }) => {
        //       return <div {...restProps}></div>;
        //     },
        //   },
        // }}
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
