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
  const [icons, setIcons] = useState(null);

  const getFlatIcon = async () => {
    var headers = {
      Accept: "application/json",
      Authorization: "string",
    };
    console.log(`hi`);
    const { data } = await axios
      .get("/api/external/getFlatIcon")
      .then((response) => {
        if (!response) {
          return getFlatIconToken();
        }
        return response.data;
      });

    console.log(`data`, data);
    const iconArr = data.map((item) => {
      const { images } = item;
      const { svg, png } = images;
      if (svg) {
        return svg;
      } else if (png) return png[128];
    });
    setIcons(iconArr);
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
            getFlatIcon();
          }}
        >
          Click to get animal icons
        </p>

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
