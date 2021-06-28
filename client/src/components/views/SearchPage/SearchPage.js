import React, { useState, useEffect } from "react";
import SelectorBar from "./Sections/SelectorBar";
import TagContainer from "./Sections/TagContainer";
import { css } from "@emotion/css";
import { getCards } from "../../../api";

export default function SearchPage() {
  const [tagValue, setTagValue] = useState();
  const [allTags, setAllTags] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const { data } = await getCards();
      const cards = data.cards;
      const allUserTags = cards.reduce((prev, card) => {
        const tagNames = card.tags
          .filter((tag) => !prev.includes(tag.name))
          .map((tag) => {
            return { label: tag.name, value: tag.name };
          });
        return prev.concat(tagNames);
      }, []);
      console.log(`allUserTags`, allUserTags);
      setAllTags(allUserTags);
    }
    fetchData();
  }, []);

  async function fetchTagList(search) {
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
    <div>
      Search Page
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <SelectorBar
          mode="multiple"
          tagvalue={tagValue}
          tagRender={TagContainer}
          placeholder="Select buddies"
          fetchOptions={fetchTagList}
          onChange={(newTagValue) => {
            console.log(`newTagValue`, newTagValue);
            setTagValue(newTagValue);
          }}
          className={css`
            min-width: 200px;
          `}
        />
      </div>
      <div>Monster images</div>
      <div>sections in common</div>
      <div>lists in common</div>
      <div>cards in common </div>
    </div>
  );
}
