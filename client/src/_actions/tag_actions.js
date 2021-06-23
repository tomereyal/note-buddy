import * as api from "../api";
import {
  GET_TAGS,
  CREATE_TAG,
  DELETE_TAG,
  UPDATE_TAG,
  ADD_CARD_TO_TAG,
  DELETE_CARD_FROM_TAG,
} from "./types";
import { message } from "antd";

export const getTags = () => async (dispatch) => {
  try {
    const { data } = await api.getTags();
    console.log(`getTags data payload: `, data);
    dispatch({ type: GET_TAGS, payload: data.tags });
  } catch (error) {
    console.log(error.message);
  }
};

export const createTag = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createTag(variables);
    console.log(`createTag data payload: `, data);
    dispatch({ type: CREATE_TAG, payload: data.tagInfo });
    if (data.success) {
      message.success("Tag was Created");
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteTag = (tagId) => async (dispatch) => {
  try {
    api.deleteTag(tagId);
    dispatch({ type: DELETE_TAG, payload: tagId });
    message.success("Tag was deleted");
  } catch (error) {
    console.log(error.message);
  }
};


export const updateTag = (variables) => async (dispatch) => {
    try {
      const { data } = await api.updateTag(variables);
      console.log(`updateTag data payload: `, data);
      dispatch({ type: UPDATE_TAG, payload: data });
      if (data.success) {
        message.success("tag was updated");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

// export const addCardToTag = (variables) => async (dispatch) => {
//   try {
//     const { data } = await api.addCardToTag(variables);
//     console.log(`addCardToTag data payload: `, data);
//     dispatch({ type: ADD_CARD_TO_TAG, payload: data });
//     if (data.success) {
//       message.success("Card was added to tag");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };
