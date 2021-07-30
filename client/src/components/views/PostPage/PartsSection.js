import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";
import PostComponent from "./Sections/PostComponent";
import { Button, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import ChildPostForm from "./Sections/ChildPostForm";

export default function PartsSection({ post = {} }) {
  const [isComponentModalVisibile, setIsComponentModalVisibile] =
    useState(false);

  return (
    <div>
      <Button
        onClick={() => {
          setIsComponentModalVisibile(true);
        }}
        icon={<span>+</span>}
      >
        Parts
      </Button>

      {post.components?.length > 0 && (
        <>
          <Row justify="center">
            <Col>
              <h3 style={{ fontFamily: "monospace" }}>Components</h3>
            </Col>
          </Row>
          <Row>
            {post.components.map((component, index) => {
              return (
                <Col key={component.name + index}>
                  <PostComponent
                    component={component}
                    parentPost={post}
                  ></PostComponent>
                </Col>
              );
            })}
          </Row>
        </>
      )}

      <ChildPostForm
        isComponentModalVisibile={isComponentModalVisibile}
        setIsComponentModalVisibile={setIsComponentModalVisibile}
        parentPost={post}
      ></ChildPostForm>
    </div>
  );
}
