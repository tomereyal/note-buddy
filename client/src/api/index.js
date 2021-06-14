import axios from "axios";
import { POST_SERVER, FOLDER_SERVER } from "../components/Config.js";

//=========================================
//                _POST
//=========================================
export const fetchPosts = () => axios.get(`${POST_SERVER}/fetchPosts`);
export const deletePost = (postId) =>
  axios.delete(`${POST_SERVER}/deletePost/${postId}`);
export const createPostInServer = (variables) =>
  axios.post(`${POST_SERVER}/createPost`, variables);
export const createSectionInPost = (variables) =>
  axios.post(`${POST_SERVER}/createSectionInPost`, variables);

//-----------------------------------------

//=========================================
//                _FOLDER
//=========================================
export const fetchFolders = () => axios.get(`${FOLDER_SERVER}/fetchFolders`);
export const createFolder = (folderVariables) =>
  axios.post(`${FOLDER_SERVER}/createFolder`, folderVariables);
export const deleteFolder = (folderId) =>
  axios.delete(`${FOLDER_SERVER}/deleteFolder/${folderId}`);
export const createPostInFolderApi = (variables) =>
  axios.post(`${FOLDER_SERVER}/createPostInFolder`, variables);
  export const addPostToFolder = (variables) =>
  axios.post(`${FOLDER_SERVER}/addPostToFolder`, variables);
export const renameFolder = (folderName) =>
  axios.post(`${FOLDER_SERVER}/renameFolder`, folderName);
export const deletePostFromFolder = (variables) =>
  axios.post(`${FOLDER_SERVER}/deletePostFromFolder`, variables);
//-----------------------------------------
