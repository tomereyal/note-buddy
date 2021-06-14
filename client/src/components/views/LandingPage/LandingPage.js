import React, { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import { getPosts } from "../../../_actions/post_actions";
import { createFolder } from "../../../_actions/folder_actions";
import { useSelector, useDispatch } from "react-redux";

import { Button } from "antd";
function LandingPage() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const user = useSelector((state) => state.user);
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
          Let's Start Coding!
        </span>
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
