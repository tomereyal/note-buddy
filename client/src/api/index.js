import axios from "axios";
import {
  POST_SERVER,
  FOLDER_SERVER,
  USER_SERVER,
  CARD_SERVER,
  CHAIN_SERVER,
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
export const fetchPost = (postId) =>
  axios.get(`${POST_SERVER}/fetchPost/${postId}`);
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
export const createListInSection = (variables) =>
  axios.post(`${POST_SERVER}/createListInSection`, variables);
export const removeListFromSection = (variables) =>
  axios.post(`${POST_SERVER}/removeListFromSection`, variables);
export const editList = (variables) =>
  axios.post(`${POST_SERVER}/editList`, variables);
export const createCardInList = (variables) =>
  axios.post(`${POST_SERVER}/createCardInList`, variables);
export const addCardToList = (variables) =>
  axios.post(`${POST_SERVER}/addCardToList`, variables);
export const removeCardFromList = (variables) =>
  axios.post(`${POST_SERVER}/removeCardFromList`, variables);

//-----------------------------------------

//=========================================
//                _CHAIN
//=========================================
export const createChain = (variables) =>
  axios.post(`${CHAIN_SERVER}/createChain`, variables);
export const createExampleChain = (variables) =>
  axios.post(`${CHAIN_SERVER}/createExampleChain`, variables);
export const fetchChainsByIds = (variables) =>
  axios.post(`${CHAIN_SERVER}/fetchChainsByIds`, variables);
export const deleteChain = (chainId) =>
  axios.delete(`${CHAIN_SERVER}/deleteChain/${chainId}`);
export const editChain = (variables) => {
  return axios.put(`${CHAIN_SERVER}/${variables.id}`, variables.updates);
};
export const createCardInChain = (variables) =>
  axios.post(`${CHAIN_SERVER}/createCardInChain`, variables);
//=========================================
//                _CARD
//=========================================
export const getCards = () => axios.get(`${CARD_SERVER}/fetchCards`);
export const createCard = (variables) =>
  axios.post(`${CARD_SERVER}/createCard`, variables);
export const deleteCard = (cardId) => axios.delete(`${CARD_SERVER}/${cardId}`);
export const getCardTags = () => axios.get(`${CARD_SERVER}/fetchCardTags`);
export const getTaggedCards = (tagName) =>
  axios.get(`${CARD_SERVER}/fetchTaggedCards/${tagName}`);
export const editCard = (variables) =>
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
export const editFolder = (variables) =>
  axios.put(`${FOLDER_SERVER}/${variables.folderId}`, variables.updates);
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

//=========================================
//                _EXTERNAL
//=========================================

/**
 *
 * @param {String} q name of image request..
 * @param {Number} pageNumber   page number of results found. Default: 1
 * @param {Number} pageSize   amount of images recieved. Default: 1
 * @param {Boolean} autoCorrect should name of image "q" param be corrected on spelling error?. Default: true
 * @returns {Array} array of image url strings
 */

export const fetchGoogleImage = async (
  q,
  pageNumber = 1,
  pageSize = 1,
  autoCorrect = true
) => {
  if (!q) {
    console.log(`No image string provided`);
    return;
  }
  var config = {
    method: "get",
    url: `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI?q=${q}&pageNumber=${pageNumber}&pageSize=${pageSize}&autoCorrect=${autoCorrect}`,
    headers: {
      "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      "x-rapidapi-key": "9b7e5fef72msh9c35beb155a0d82p148617jsn9c83266cfd54",
    },
  };

  return axios(config)
    .then(function (response) {
      const imageArray = response.data.value;
      const urlArray = imageArray.map((image) => image.url);
      return urlArray;
    })
    .catch(function (error) {
      console.log(error);
    });
};
