import * as api from "../api";
import {
  FETCH_ALL_FOLDERS,
  CREATE_FOLDER,
  DELETE_FOLDER,
  MOVE_TO_TRASH_FOLDER,
  CREATE_POST,
  DELETE_POST_FROM_FOLDER,
  ADD_POST_TO_FOLDER,
  EDIT_FOLDER,
} from "./types";
import { message } from "antd";

export const getFolders = () => async (dispatch) => {
  try {
    let { data } = await api.fetchFolders();

    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    dispatch({ type: FETCH_ALL_FOLDERS, payload: data.folders });
  } catch (error) {
    console.log(error.message);
  }
};

export const editFolder = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editFolder(variables);
    const [folder] = data.folder;
    dispatch({ type: EDIT_FOLDER, payload: folder });
  } catch (error) {
    console.log(error.message);
  }
};

export const createFolder = (folderVariables) => async (dispatch) => {
  try {
    const { data } = await api.createFolder(folderVariables);
    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    dispatch({ type: CREATE_FOLDER, payload: data.folderInfo });
    if (data.success) {
      message.success("Folder was Created");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteFolder = (folderId) => async (dispatch) => {
  try {
    api.deleteFolder(folderId);
    dispatch({ type: DELETE_FOLDER, payload: folderId });
    dispatch({ type: MOVE_TO_TRASH_FOLDER, payload: folderId });
    message.success("Folder was deleted");
  } catch (error) {
    console.log(error.message);
  }
};

export const createPostInFolder = (variables) => async (dispatch) => {
  try {
    console.log(`variables`, variables);
    const { postVariables, folderId } = variables;
    console.log(`postVariables actions`, postVariables);
    const postRes = await api.createPostInServer(postVariables);
    const newPost = postRes.data.postInfo;
    dispatch({ type: CREATE_POST, payload: newPost });
    const newPostId = postRes.data.postInfo._id;
    const { data } = await api.addPostToFolder({ newPostId, folderId });
    const folder = data;
    //we want to return the updated folder to reducer to update app folders state;
    dispatch({ type: ADD_POST_TO_FOLDER, payload: folder });
    return newPostId;
  } catch (error) {}
};

export const addPostToFolder = (variables) => async (dispatch) => {
  try {
    const res = await api.addPostToFolder(variables);
    const { data } = res;
    dispatch({ type: ADD_POST_TO_FOLDER, payload: data });
  } catch (error) {}
};

export const deletePostFromFolder = (variables) => async (dispatch) => {
  try {
    const res = await api.deletePostFromFolder(variables);
    const { data } = res;
    console.log(`res`, res);
    console.log(`data`, data);
    dispatch({ type: DELETE_POST_FROM_FOLDER, payload: data });
    if (data.success) {
      message.success("Post was removed from folder");
    }
  } catch (error) {
    console.log(error.message);
  }
};
