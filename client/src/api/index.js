import axios from "axios";
import {
  POST_SERVER,
  FOLDER_SERVER,
  USER_SERVER,
  CARD_SERVER,
} from "../components/Config.js";

//=========================================
//                _USER
//=========================================
export const getUserSettings = (userId) => {
  axios.get(`${USER_SERVER}/getUserSettings/${userId}`);
};

//=========================================
//                _POST
//=========================================
export const fetchPosts = () => axios.get(`${POST_SERVER}/fetchPosts`);
export const deletePost = (postId) =>
  axios.delete(`${POST_SERVER}/deletePost/${postId}`);
export const editPost = (variables) =>
  axios.post(`${POST_SERVER}/editPost`, variables);
export const createPostInServer = (variables) =>
  axios.post(`${POST_SERVER}/createPost`, variables);
export const createSectionInPost = (variables) =>
  axios.post(`${POST_SERVER}/createSectionInPost`, variables);
export const removeSectionFromPost = (variables) =>
  axios.post(`${POST_SERVER}/removeSectionFromPost`, variables);
export const editSection = (variables) =>
  axios.post(`${POST_SERVER}/editSection`, variables);
export const setSectionBgc = (variables) =>
  axios.post(`${POST_SERVER}/setSectionBgc`, variables);
export const setSectionPattern = (variables) =>
  axios.post(`${POST_SERVER}/setSectionPattern`, variables);
export const createListInSection = (variables) =>
  axios.post(`${POST_SERVER}/createListInSection`, variables);
export const removeListFromSection = (variables) =>
  axios.post(`${POST_SERVER}/removeListFromSection`, variables);
export const editList = (variables) =>
  axios.post(`${POST_SERVER}/editList`, variables);
export const createCardInList = (variables) =>
  axios.post(`${POST_SERVER}/createCardInList`, variables);
export const removeCardFromList = (variables) =>
  axios.post(`${POST_SERVER}/removeCardFromList`, variables);
//-----------------------------------------

//=========================================
//                _CARD
//=========================================
export const getCards = () => axios.get(`${CARD_SERVER}/fetchCards`);
export const getCardTags = () => axios.get(`${CARD_SERVER}/fetchCardTags`);
export const getTaggedCards = (tagName) =>
  axios.get(`${CARD_SERVER}/fetchTaggedCards/${tagName}`);
export const editNote = (variables) =>
  axios.put(`${CARD_SERVER}/${variables.id}`, variables.updates);
export const saveNewNoteTags = (variables) =>
  axios.post(`${CARD_SERVER}/saveNewNoteTags`, variables);
export const saveExistingNoteTags = (variables) =>
  axios.post(`${CARD_SERVER}/saveExistingNoteTags`, variables);
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
