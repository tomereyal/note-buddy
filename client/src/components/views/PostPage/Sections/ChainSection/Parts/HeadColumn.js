import React from "react";
import { Button, Avatar } from "antd";
import ContainerWithMenu from "../../../../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "../../SelectWithToggle";
import TitleEditor from "../../../../../editor/TitleEditor/TitleEditor";
import CreatePostModule from "../../../../CreatePostModule";
import { useHistory } from "react-router-dom";
export default function HeadColumn({
  heads,
  row,
  postsNameAndId,
  createNewHead,
  addNewHead,
  removeHead,
}) {
  let history = useHistory();

  return (
    <ContainerWithMenu
      key={"heads" + row._id}
      menu={
        <div>
          <SelectWithToggle
            options={postsNameAndId}
            onSelect={addNewHead(row.chainId, heads)}
          />
          <CreatePostModule createPostFunction={createNewHead(row.chainId)} />
        </div>
      }
    >
      {heads?.map((head, index) => {
        return (
          <div style={{ position: "relative" }} key={head._id}>
            <ContainerWithMenu
              key={head._id + index}
              leftMenu={
                <Button
                  size="small"
                  shape="circle"
                  onClick={removeHead(row.chainId, heads, head._id)}
                >
                  X
                </Button>
              }
            >
              <div style={{ paddingLeft: "24px", display: "flex" }}>
                <Avatar
                  src={head.image}
                  onClick={() => {
                    history.push(`/post/${head._id}`);
                  }}
                ></Avatar>
                <div>
                  <TitleEditor
                    isReadOnly={true}
                    title={head.title}
                    name={head.name}
                    style={{
                      fontSize: "14px",
                      backgroundColor: "transparent",
                    }}
                  />
                  {head.conditions ? (
                    <TitleEditor
                      isReadOnly={true}
                      title={head.conditions}
                      style={{
                        fontSize: "10px",
                        color: "red",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </ContainerWithMenu>
          </div>
        );
      })}
    </ContainerWithMenu>
  );
}
