import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFolder } from "../../../../_actions/folder_actions";
import { Menu } from "antd";
import { TeamOutlined, DeleteOutlined } from "@ant-design/icons";
import BlogSubmenu from "./BlogSubmenu";
import axios from "axios";

const { SubMenu } = Menu;

export default function FolderSubmenu({
  folder,
  setSelectedFolder,
  setOpenKeys,
  folders,
  collapsed,
  index,
  renderSubMenu,
}) {
  const dispatch = useDispatch();
  const removeFolder = (folder) => {
    if (!folder._id) {
      //also validate if the user is logged in..
      return;
    }
    dispatch(deleteFolder(folder._id));
  };
  // console.log(`the key each sub menu gets..`, `sub${index + 1}`);
  return (
    <SubMenu
      key={`sub${index + 1}`}
      icon={
        collapsed ? (
          <TeamOutlined />
        ) : (
          <>
            {" "}
            <DeleteOutlined
              onClick={() => {
                //SETSTATE BELOW DOESNT WORK :(  !!!!
                setSelectedFolder((prevSelected) => {
                  console.log(
                    `trying to change prev selected Folder :`,
                    prevSelected
                  );
                  return folders ? { ...folders[0] } : "No Folder";
                });

                removeFolder(folder);
              }}
            />
            <DeleteOutlined />
          </>
        )
      }
      title={folder.name}
      onTitleClick={() => {
        console.log(`folder`, folder);
        console.log(`the key of this :`, `sub${index + 1}`);
        setOpenKeys([`sub${index + 1}`]);
        setSelectedFolder(folder);
      }}
      onTitleMouseEnter={() => {
        console.log("show edit buttons");
      }}
    >
      {folder.blogs && renderSubMenu}
    </SubMenu>
  );
}
