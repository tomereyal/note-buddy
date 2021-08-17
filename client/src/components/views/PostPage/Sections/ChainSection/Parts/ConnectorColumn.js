import React from "react";
import { Button, Row, Col, Tooltip } from "antd";
import ContainerWithMenu from "../../../../BasicComponents/ContainerWithMenu";
import SelectWithToggle from "../../SelectWithToggle";
import { addStyles, StaticMathField } from "react-mathquill";
import NoteCard from "../../NoteCard";
addStyles();

export default function ConnectorColumn({
  connector,
  row,
  cardsNameAndId,
  createConnector,
  addNewConnector,
  removeConnector,
  changeChainType,
}) {
  const arrowLatex =
    row.type === "uniDirectional"
      ? "\\longrightarrow "
      : "\\longleftrightarrow";
  return (
    <ContainerWithMenu
      key={"connector" + row._id}
      menu={
        <SelectWithToggle
          options={cardsNameAndId}
          onSelect={addNewConnector(row.chainId, connector)}
        />
      }
    >
      <Row justify="center">
        <Col>
          {connector ? (
            <div style={{ position: "relative" }} key={connector._id}>
              <ContainerWithMenu
                key={connector._id}
                leftMenu={
                  <Button
                    size="small"
                    shape="circle"
                    onClick={removeConnector(row.chainId)}
                  >
                    X
                  </Button>
                }
              >
                <div>
                  <a>
                    <NoteCard
                      card={connector}
                      simpleStyle={true}
                      isDeletable={false}
                    ></NoteCard>
                  </a>
                </div>
              </ContainerWithMenu>
            </div>
          ) : (
            <Tooltip title="add card">
              <Button size="small" onClick={createConnector(row.chainId)}>
                +
              </Button>
            </Tooltip>
          )}
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: "5px" }}>
        <Col>
          <Button
            size="small"
            style={{ zIndex: 1 }}
            onClick={changeChainType(row.chainId, row.type)}
          >
            <StaticMathField>{arrowLatex}</StaticMathField>
          </Button>
        </Col>
      </Row>
    </ContainerWithMenu>
  );
}
