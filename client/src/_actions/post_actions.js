import * as api from "../api";
import {
  DELETE_POST,
  FETCH_ALL_POSTS,
  CREATE_POST,
  CREATE_SECTION_IN_POST,
  REMOVE_SECTION_FROM_POST,
  EDIT_POST,
  EDIT_SECTION,
  CREATE_LIST_IN_SECTION,
  REMOVE_LIST_FROM_SECTION,
  EDIT_LIST,
  CREATE_CARD_IN_LIST,
  ADD_CARD_TO_LIST,
  REMOVE_CARD_FROM_LIST,
} from "./types";

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    console.log(`data.blogs`, data.blogs);
    dispatch({ type: FETCH_ALL_POSTS, payload: data.blogs });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (postVariables, post) => async (dispatch) => {
  try {
    //if posted wasnt created in the server by the component..
    if (!post) {
      // const cardData = await api.createCard();
      const { data } = await api.createPostInServer(postVariables);
      if (data.success) {
        post = data.postInfo;
      }
    }
    dispatch({ type: CREATE_POST, payload: post });
    return post;
  } catch (error) {
    console.log(error.message);
  }
};
export const editPost = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editPost(variables);
    dispatch({ type: EDIT_POST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePost = (postId) => async (dispatch) => {
  try {
    api.deletePost(postId);
    dispatch({ type: DELETE_POST, payload: postId });
  } catch (error) {
    console.log(error.message);
  }
};

export const createSectionInPost = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createSectionInPost(variables);
    console.log(`data from createSectionInPost`, data);
    dispatch({ type: CREATE_SECTION_IN_POST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const removeSectionFromPost = (variables) => async (dispatch) => {
  try {
    const { data } = await api.removeSectionFromPost(variables);
    console.log(`data from removeSectionFromPost`, data);
    dispatch({ type: REMOVE_SECTION_FROM_POST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const editSection = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editSection(variables);
    dispatch({ type: EDIT_SECTION, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createListInSection = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createListInSection(variables);
    console.log(`data from createListInPost`, data);
    dispatch({ type: CREATE_LIST_IN_SECTION, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const removeListFromSection = (variables) => async (dispatch) => {
  try {
    const { data } = await api.removeListFromSection(variables);
    console.log(`data from removeListFromSection`, data);
    dispatch({ type: REMOVE_LIST_FROM_SECTION, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const editList = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editList(variables);
    dispatch({ type: EDIT_LIST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const createCardInList = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createCardInList(variables);
    console.log(`data from createCardInList`, data);
    dispatch({ type: CREATE_CARD_IN_LIST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const addCardToList = (variables) => async (dispatch) => {
  try {
    const { data } = await api.addCardToList(variables);
    console.log(`data from addCardToList`, data);
    dispatch({ type: ADD_CARD_TO_LIST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const removeCardFromList = (variables) => async (dispatch) => {
  try {
    const { data } = await api.removeCardFromList(variables);
    console.log(`data from removeCardFromList`, data);
    dispatch({ type: REMOVE_CARD_FROM_LIST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
