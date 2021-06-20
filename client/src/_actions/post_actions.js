import * as api from "../api";
import {
  DELETE_POST,
  FETCH_ALL_POSTS,
  CREATE_POST,
  CREATE_SECTION_IN_POST,
  REMOVE_SECTION_FROM_POST,
  SET_POST_TITLE,
  SET_SECTION_BGC,
  SET_SECTION_PATTERN,
  SET_SECTION_TITLE,
  CREATE_LIST_IN_SECTION,
  REMOVE_LIST_FROM_SECTION,
  SET_LIST_TITLE,
  CREATE_CARD_IN_LIST,
  REMOVE_CARD_FROM_LIST,
  EDIT_NOTE,
} from "./types";

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    dispatch({ type: FETCH_ALL_POSTS, payload: data.blogs });
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (postVariables, post) => async (dispatch) => {
  try {
    //if posted wasnt created in the server by the component..
    if (!post) {
      const { data } = await api.createPostInServer(postVariables);
      if (data.success) {
        const post = data.postInfo;
      }
    }
    dispatch({ type: CREATE_POST, payload: post });
  } catch (error) {
    console.log(error.message);
  }
};
export const setPostTitle = (variables) => async (dispatch) => {
  try {
    const { data } = await api.setPostTitle(variables);
    dispatch({ type: SET_POST_TITLE, payload: data });
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

export const setSectionBgc = (variables) => async (dispatch) => {
  try {
    const { data } = await api.setSectionBgc(variables);

    dispatch({ type: SET_SECTION_BGC, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const setSectionPattern = (variables) => async (dispatch) => {
  try {
    const { data } = await api.setSectionPattern(variables);
    dispatch({ type: SET_SECTION_PATTERN, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const setSectionTitle = (variables) => async (dispatch) => {
  try {
    const { data } = await api.setSectionTitle(variables);
    dispatch({ type: SET_SECTION_TITLE, payload: data });
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
export const setListTitle = (variables) => async (dispatch) => {
  try {
    const { data } = await api.setListTitle(variables);
    dispatch({ type: SET_LIST_TITLE, payload: data });
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
export const removeCardFromList = (variables) => async (dispatch) => {
  try {
    const { data } = await api.removeCardFromList(variables);
    console.log(`data from removeCardFromList`, data);
    dispatch({ type: REMOVE_CARD_FROM_LIST, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const editNote = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editNote(variables);
    dispatch({ type: EDIT_NOTE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
