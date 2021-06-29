import React, { useState, useEffect } from "react";
import SelectorBar from "./Sections/SelectorBar";
import TagContainer from "./Sections/TagContainer";
import SlateEditor from "../../editor/SlateEditor";
import { css } from "@emotion/css";
import { getCards, getTaggedCards } from "../../../api";
import { Row, Col, Divider, Card } from "antd";
import Avatar from "antd/lib/avatar/avatar";

export default function SearchPage() {
  const [selectedTagsValue, setSelectedTagsValue] = useState([]);
  const [mappedSelectedTags, setMappedSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState(null);

  console.log(`mappedSelectedTags`, mappedSelectedTags);
  useEffect(() => {
    if (!allTags) {
      async function fetchData() {
        const { data } = await getCards(); // maybe store the cards in redux state for faster loading?
        const cards = data.cards;
        const allUserTags = cards.reduce((prev, card) => {
          const tagNames = card.tags
            .filter((tag) => !prev.includes(tag.name))
            .map((tag) => {
              return {
                label: tag.name,
                value: tag.name,
                fetchedtag: tag,
              };
            });
          return prev.concat(tagNames);
        }, []);
        console.log(`allUserTags`, allUserTags);
        setAllTags(allUserTags);
      }
      fetchData();
      return;
    }
    if (selectedTagsValue.length > 0) {
      async function mapSelectedTags() {
        const tagsFromAllTags = selectedTagsValue.reduce(
          (prev, selectedTag) => {
            const foundTag = allTags.find(
              (tag) => tag.fetchedtag.name == selectedTag.label
            );
            return foundTag ? prev.concat(foundTag.fetchedtag) : prev;
          },
          []
        );

        const tagsWithCardsPromises = await tagsFromAllTags.map(async (tag) => {
          const { data } = await getTaggedCards(tag.name);
          return { ...tag, cards: data.cards };
        });

        const tagsWithCards = await Promise.all(tagsWithCardsPromises);
        setMappedSelectedTags(tagsWithCards);
      }
      mapSelectedTags();
    }
  }, [selectedTagsValue]);

  async function fetchTagListforSelector(search) {
    if (!allTags) return;
    if (allTags.length > 0) {
      return allTags
        .filter((tag) =>
          tag.label.toLowerCase().startsWith(search.toLowerCase())
        )
        .slice(0, 10);
    }
    return allTags;
  }

  return (
    <>
      <Row justify="center" align="middle" style={{ padding: "14px 0" }}>
        <SelectorBar
          mode="multiple"
          tagvalue={selectedTagsValue}
          tagRender={TagContainer}
          placeholder="Select buddies"
          fetchOptions={fetchTagListforSelector}
          onChange={(currentSelectedTags) => {
            setSelectedTagsValue(currentSelectedTags);
          }}
          className={css`
            min-width: 200px;
          `}
        />
      </Row>
      {selectedTagsValue.length > 0 ? (
        <>
          {mappedSelectedTags.map((tag) => {
            console.log(`tag`, tag);
            return (
              <div key={tag._id}>
                <Divider> Monsters' image </Divider>
                <Row justify="center" align="middle">
                  <Col key={tag._id}>
                    <div>{tag.name}</div>
                    <Avatar src={tag.image}></Avatar>
                  </Col>
                </Row>
                <Divider> Section Links </Divider>
                <Row justify="center" align="middle">
                  sections in common
                </Row>
                <Divider> List Links </Divider>
                <Row justify="center" align="middle">
                  lists in common
                </Row>
                <Divider> Cards </Divider>
                <Row justify="center" align="middle">
                  {tag.cards &&
                    tag.cards.map((card, index, cards) => {
                      const { post, section, list, _id } = card.location;

                      return (
                        <Col key={card._id}>
                          {" "}
                          <Card
                            bodyStyle={{ padding: "2px" }}
                            style={{ width: "100%" }}
                            hoverable={true}
                          >
                            <SlateEditor
                              listCardCount={cards.length}
                              card={card}
                              listId={list}
                              sectionId={section}
                              postId={post}
                              order={index}
                              key={card._id}
                              style={{ width: "100%" }}
                            ></SlateEditor>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <Divider> Monsters' image </Divider>
          <Divider> Section Links </Divider>
          <Divider> List Links </Divider>
          <Divider> Cards </Divider>
        </>
      )}
    </>
  );
}
