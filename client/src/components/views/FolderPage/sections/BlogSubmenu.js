import React from "react";
import { Menu } from "antd";

export default function BlogSubmenu(blog, setBlog, index) {
  return (
    <Menu.Item
      key={`subsub${index + 1}`}
      onClick={() => {
        console.log("load this blog.. setBlog(" + blog + ")");
        console.log(`blog`, blog);
        setBlog(blog);
      }}
    >
      {blog.name}
    </Menu.Item>
  );
}
