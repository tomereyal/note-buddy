import * as api from "../api";
import {
  DELETE_POST,
  FETCH_ALL_POSTS,
  CREATE_POST,
  CREATE_SECTION_IN_POST,
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

export const createSectionInPost = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createSectionInPost(variables);
    console.log(`data from createSectionInPost`, data);
    dispatch({ type: CREATE_SECTION_IN_POST, payload: data });
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
