import * as api from "../api";
import { FETCH_ALL_FOLDERS, CREATE_FOLDER, DELETE_FOLDER,MOVE_TO_TRASH_FOLDER } from "./types";
import { message } from "antd";

export const getFolders = () => async (dispatch) => {
  try {
    const { data } = await api.fetchFolders();
    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    dispatch({ type: FETCH_ALL_FOLDERS, payload: data.folders });
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
