import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { getFolders, editFolder } from "../../../_actions/folder_actions";

import { createCard, deleteCard } from "../../../_actions/card_actions";

import { Button, Layout, Card, Col, Row } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";
import NoteCard from "../PostPage/Sections/NoteCard";

const { Meta } = Card;

export default function CardsPage(props) {
  const folders = useSelector((state) => state.folders);
  const allCards = useSelector((state) => state.cards);
  const posts = useSelector((state) => state.posts);
  const user = useSelector((state) => state.user);

  const { folderId } = useParams();

  const initFolder = folders?.find((folder) => {
    return folder._id == folderId;
  });

  const [cards, setCards] = useState(initFolder?.cards);

  const [folder, setFolder] = useState(initFolder ? initFolder : null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const history = useHistory();

  const dispatch = useDispatch();
  // const folderId = props.folder._id;

  useEffect(() => {
    if (!folders) {
      dispatch(getFolders());
    }
    console.log(`initFolder`, initFolder);
    setCards(initFolder?.cards);
  }, [folders]);

  const deleteCardFromDB = (cardId) => {
    return function () {
      if (!cardId) {
        //also validate if the user is logged in..
        return;
      }
      dispatch(deleteCard(cardId));
      dispatch(getFolders());
    };
  };

  const createNewCard = async () => {
    if (!cards) return;

    const card = await dispatch(createCard());
    console.log(`card created in folder:`, card);
    dispatch(
      editFolder({
        folderId: initFolder._id,
        updates: {
          cards: cards
            .map(({ _id }) => {
              return _id;
            })
            .concat(card._id),
        },
      })
    );
  };

  const renderCards = initFolder
    ? initFolder.cards.map((card, index) => {
        if (card) {
          return (
            <Col key={index} lg={8} md={12} xs={24}>
              {/* <Card
                hoverable
                onClick={() => {
                  console.log(`card`, card);
                }}
                // onDoubleClick={() => {
                //   history.push(`/post/${blog._id}`);
                // }}
                actions={[
                  <DeleteOutlined
                    key="setting"
                    onClick={() => {
                      deleteCardFromFolder(card._id);
                    }}
                  />,
                  <EditOutlined key="edit" />,
                ]}
              >
                <Meta description={card.name} />
              </Card> */}
              <NoteCard
                card={card}
                onRemove={deleteCardFromDB(card._id)}
              ></NoteCard>
            </Col>
          );
        }
      })
    : null;
  console.log(`renderCards`, renderCards);

  return (
    <Layout>
      <Content>
        <div style={{ width: "80%", margin: "1rem auto" }}>
          <Row justify="space-around" gutter={[32, 16]}>
            {initFolder && renderCards}
            <Col
              lg={8}
              md={12}
              xs={24}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Button onClick={createNewCard}> create new card</Button>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
