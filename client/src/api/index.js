import axios from "axios";
import { POST_SERVER, FOLDER_SERVER } from "../components/Config.js";

//=========================================
//                _POST
//=========================================
export const fetchPosts = () => axios.get(`${POST_SERVER}/fetchPosts`);
//-----------------------------------------

//=========================================
//                _FOLDER
//=========================================
export const fetchFolders = () => axios.get(`${FOLDER_SERVER}/fetchFolders`);
export const createFolder = (folderVariables) =>
  axios.post(`${FOLDER_SERVER}/createFolder`, folderVariables);
export const deleteFolder = (folderId)=>axios.delete(`${FOLDER_SERVER}/deleteFolder/${folderId}`)
export const renameFolder = (folderName) =>
  axios.post(`${FOLDER_SERVER}/renameFolder`, folderName);
//-----------------------------------------
