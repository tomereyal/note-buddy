import React, { Suspense, useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import CreatePage from "./views/BlogPage/Sections/CreatePage.js";
import BlogPage from "./views/BlogPage/BlogPage.js";
import PostPage from "./views/PostPage/PostPage.js";
import SearchPage from "./views/SearchPage/SearchPage";
import "./App.css";

import FolderPage from "./views/FolderPage/FolderPage";
import SettingsPage from "./views/SettingsPage/SettingsPage";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../_actions/post_actions";
import { getFolders } from "../_actions/folder_actions";
import TestPage from "./views/TestPage/TestPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";

import { ConfigProvider } from "antd";
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  //this dispatch must be in the app for it to update all the pages..
  //when I put this in LandindPage I updated the posts, but when going to different pages
  //The got my state with the user and posts but the posts were an empty array!

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getFolders());
  }, []);
  const direction = useSelector(
    (state) => state.settings.general_config.direction
  );

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar />

        <ConfigProvider direction={direction}>
          <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
            <Switch>
              <Route exact path="/" component={Auth(LandingPage, null)} />
              <Route exact path="/login" component={Auth(LoginPage, false)} />
              <Route
                exact
                path="/register"
                component={Auth(RegisterPage, false)}
              />
              <Route path="/folders" component={Auth(FolderPage, null)} />
              <Route path="/test" component={Auth(TestPage, null)} />
              <Route
                exact
                path="/post/:postId"
                component={Auth(PostPage, null)}
              />
              <Route
                exact
                path="/settings"
                component={Auth(SettingsPage, null)}
              />
              <Route
                exact
                path="/profile"
                component={Auth(ProfilePage, null)}
              />
              <Route exact path="/search" component={Auth(SearchPage, null)} />
              <Route
                exact
                path="/blog/post/:postId"
                component={Auth(PostPage, null)}
              />
              <Route
                exact
                path="/blog/create"
                component={Auth(CreatePage, null)}
              />
              <Route exact path="/blog" component={Auth(BlogPage, null)} />
            </Switch>{" "}
          </div>
        </ConfigProvider>

        {/* <Footer /> */}
      </Suspense>
    </div>
  );
}

export default App;
