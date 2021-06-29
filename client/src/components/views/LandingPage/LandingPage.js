import React, { useEffect, useState } from "react";
import { FaCode } from "react-icons/fa";
import { getPosts } from "../../../_actions/post_actions";
import { createFolder } from "../../../_actions/folder_actions";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import { Button } from "antd";
function LandingPage() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const user = useSelector((state) => state.user);
  const [icons, setIcons] = useState([]);
  const [allIcons, setAllIcons] = useState([]);
  const [iconsInDB, setIconsInDB] = useState();
  useEffect(() => {
    async function getIconsInDB() {
      const { data } = await axios.get("/api/external/fetchIconsInDb");
      const fetchedIcons = data.doc.icons;
      console.log(`fetchedIcons`, fetchedIcons);
      setIconsInDB(fetchedIcons);
    }
    getIconsInDB();
  }, []);

  const getFlatIcon = async (iconName) => {
    var headers = {
      Accept: "application/json",
      Authorization: "string",
    };
    console.log(`hi`);
    const { data } = await axios
      .get(`/api/external/getFlatIcon/q=${iconName}&page=10`)
      .then((response) => {
        if (!response) {
          throw new Error("Oh no!");
        }
        console.log(`if no response will i be reached? `);
        return response.data;
      })
      .catch(async (error) => {
        const res = await getFlatIconToken();
        console.log(`res`, res);
      })
      .then((response) => {
        return response.data;
      });

    console.log(`allIcons`, allIcons);

    const fullIconArr = data.reduce((prev, item) => {
      const { images, id, style_name } = item;
      const { svg, png } = images;
      if (svg && style_name === "Flat") {
        return prev.concat([{ svg, id }]);
      }
      return prev;
    }, []);

    const flatIconsIdArr = fullIconArr.map((icon) => icon.id);
    const storedIcons = iconsInDB.length > 0 ? iconsInDB : [];
    const filteredAllIcons =
      allIcons.length > 0
        ? allIcons.filter((myIcon) => {
            return !flatIconsIdArr.includes(myIcon.id);
          })
        : [];

    console.log(`allIcons`, allIcons);

    setAllIcons(filteredAllIcons.concat(fullIconArr));

    const iconArr = fullIconArr.map((icon) => icon.svg);
    setIcons((prev) => {
      return filteredAllIcons.concat(fullIconArr).map((icon) => icon.svg);
    });
  };

  const getFlatIconToken = async () => {
    console.log(`hi`);
    const token = await axios
      .post("/api/external/getFlatIconToken")
      .then((response) => {
        return response.data;
      });
    console.log(`bye`);
    console.log(`token`, token);
  };

  const renderIcons = icons
    ? icons.map((svg, index) => {
        return (
          <img height="30px" width="30px" src={svg} key={index + svg[3]} />
        );
      })
    : null;

  return (
    <>
      <div className="app">
        <FaCode style={{ fontSize: "4rem" }} />
        <br />
        <span
          onClick={() => {
            console.log(`state`, state);
          }}
          style={{ fontSize: "2rem" }}
        >
          Let's Start Coding! (click to check state)
        </span>
        <p
          onClick={() => {
            getFlatIconToken();
          }}
        >
          Click to get flatIconApiToken
        </p>
        <p
          onClick={() => {
            getFlatIcon("monster");
          }}
        >
          Click to get animal icons
        </p>
        <Button
          onClick={async () => {
            console.log(`allIcons`, allIcons);
            const data = await axios.post("/api/external/saveIcons", {
              allIcons,
            });
            console.log(`data`, data);
          }}
        >
          save icons to db
        </Button>
        {icons ? (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "420px",
              height: "420px",
            }}
          >
            {" "}
            {renderIcons}{" "}
          </div>
        ) : null}
        <Button
          onClick={() => {
            const variables = {
              name: "Recent Blogs",
              blogs: [],
              writer: user.userData._id,
            };
            console.log(
              "attemping to post from this route /api/blog/createFolder"
            );
            dispatch(createFolder(variables));
          }}
        >
          Add folder
        </Button>
      </div>
      <div style={{ float: "right" }}>
        Thanks For Using This Boiler Plate by John Ahn
      </div>
    </>
  );
}

export default LandingPage;
