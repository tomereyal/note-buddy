import React from "react";
import { Button, Avatar } from "antd";
import ContainerWithMenu from "../../../../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "../../SelectWithToggle";
import TitleEditor from "../../../../../editor/TitleEditor/TitleEditor";
import CreatePostModule from "../../../../CreatePostModule";
import { useHistory } from "react-router-dom";

export default function OutcomeColumn({
  outcomes,
  row,
  postsNameAndId,
  isExample,
  createNewOutcome,
  addNewOutcome,
  removeOutcome,
}) {
  let history = useHistory();

  return (
    <ContainerWithMenu
      key={"outcomes" + row._id}
      menu={
        !isExample && (
          <div>
            <SelectWithToggle
              options={postsNameAndId}
              onSelect={addNewOutcome(row.chainId, outcomes)}
            />
            <CreatePostModule
              createPostFunction={createNewOutcome(row.chainId)}
            />
          </div>
        )
      }
    >
      {outcomes.length
        ? outcomes.map((outcome) => {
            return (
              <div style={{ position: "relative" }} key={outcome._id}>
                <ContainerWithMenu
                  key={outcome._id}
                  leftMenu={
                    !isExample && (
                      <Button
                        size="small"
                        shape="circle"
                        onClick={removeOutcome(
                          row.chainId,
                          outcomes,
                          outcome._id
                        )}
                      >
                        X
                      </Button>
                    )
                  }
                >
                  <Avatar
                    src={outcome.image}
                    onClick={() => {
                      history.push(`/post/${outcome._id}`);
                    }}
                  ></Avatar>
                  <TitleEditor
                    isReadOnly={true}
                    title={outcome.title}
                    name={outcome.name}
                    style={{
                      fontSize: "14px",
                      backgroundColor: "transparent",
                    }}
                  />
                  {outcome.conditions ? (
                    <TitleEditor
                      isReadOnly={true}
                      title={outcome.conditions}
                      style={{
                        fontSize: "10px",
                        color: "red",
                        backgroundColor: "transparent",
                      }}
                    />
                  ) : (
                    ""
                  )}
                </ContainerWithMenu>
              </div>
            );
          })
        : "No outcome added.."}
    </ContainerWithMenu>
  );
}
