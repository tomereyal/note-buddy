import React, { useEffect } from "react";
import { FaCode } from "react-icons/fa";
import { getPosts } from "../../../_actions/post_actions";
// import { useSelector } from "react-redux";
import { useSelector } from "react-redux";
function LandingPage() {

  const state = useSelector((state) => state);


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
      </div>
      <div style={{ float: "right" }}>
        Thanks For Using This Boiler Plate by John Ahn
      </div>
    </>
  );
}

export default LandingPage;
