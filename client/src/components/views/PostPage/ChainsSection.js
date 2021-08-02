import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, Tag, Space, Table, Select } from "antd";
import { createChain, fetchChainsByIds } from "../../../api";
import { editPost } from "../../../_actions/post_actions";
import ContainerWithMenu from "../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "./Sections/SelectWithToggle";

export default function ChainsSection({ post = {} }) {
  const { chains: initialChains, image, _id } = post;
  const [chains, setChains] = useState(initialChains || []);
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts)
  const postsNameAndId = posts.map(({name,_id})=>{
    return {name,_id}
  })

  useEffect(() => {
    // setChains(initialChains);
    if (chains.length) {
      console.log(`chains`, chains);
      fetchChains();
    }
    async function fetchChains() {
      const { data } = await fetchChainsByIds({ chains });
      const { chains: fetchedChains } = data;
      setChains(fetchedChains);
    }
  }, []);

  const addNewChain = async () => {
    const variables = { postId: _id };
    const { data } = await createChain(variables);
    const { chain: newChain } = data;
    const editVariables = {
      postId: _id,
      editArr: [{ editType: "chains", editValue: [...chains, newChain] }],
    };
    dispatch(editPost(editVariables));
  };

  const addNewHead = async () => {};

  const columns = [
    {
      title: "Heads",
      dataIndex: "heads",
      key: "head",
      render: (heads) =>
        heads?.map((head) => {
          return (
            <span key={head._id}>
              <ContainerWithMenu menu={<SelectWithToggle options={} />}>
                <Avatar src={head.image}></Avatar>
                {head.name}
              </ContainerWithMenu>
            </span>
          );
        }),
    },
    {
      title: "From",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Type",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Outcome",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data = chains.map((chain, index) => {
    return {
      key: index,
      heads: chain.heads,
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    };
  });
  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} />
      <div style={{ padding: "6px 4px" }}>
        <Avatar src={image}></Avatar>
        <Button onClick={addNewChain}>Add Chain to</Button>
      </div>
    </div>
  );
}
