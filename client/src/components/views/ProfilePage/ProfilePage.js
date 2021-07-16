import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Row, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
const { TabPane } = Tabs;

export default function ProfilePage() {
  const user = useSelector((state) => state.user);
  if (!user.userData) {
    return <div>Sorry no data found</div>;
  }
  return (
    <div style={{ padding: "20px 10px", height: "100%" }}>
      <Row
        justify={"center"}
        align={"middle"}
        style={{ margin: "20px 0 30px" }}
      >
        <ProfilePicture user={user}></ProfilePicture>
      </Row>
      <Row justify={"center"} align={"middle"}>
        <Tabs defaultActiveKey="1" style={{ width: "400px" }} centered>
          <TabPane tab="About" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Groups" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Friends" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Row>
    </div>
  );
}

const ProfilePicture = ({ user }) => {
  const userImage = user.userData.image;

  return (
    <>
      {userImage ? (
        <Avatar size={120} src={userImage} />
      ) : (
        <Avatar size={120} icon={<UserOutlined />} />
      )}
    </>
  );
};
