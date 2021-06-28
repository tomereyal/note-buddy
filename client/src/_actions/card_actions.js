import * as api from "../api";
import {
  CREATE_CARD_IN_LIST,
  REMOVE_CARD_FROM_LIST,
  EDIT_NOTE,
  UPDATE_CARD_IN_POST,
  GET_CARDS,
  GET_CARD_TAGS,
  SAVE_NOTE_TAGS,
} from "./types";
import { message } from "antd";

export const getCards = (variables) => async (dispatch) => {
  try {
    const { data } = await api.getCards(variables);
    console.log(`data from getCards @ card_actions.js`, data);
    dispatch({ type: GET_CARDS, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const editNote = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editNote(variables);
    dispatch({ type: EDIT_NOTE, payload: data.cardInfo });
    dispatch({ type: UPDATE_CARD_IN_POST, payload: data.cardInfo });
  } catch (error) {
    console.log(error.message);
  }
};
export const saveNoteTags = (variables) => async (dispatch) => {
  try {
    const { data } = await api.saveNoteTags(variables);
    dispatch({ type: SAVE_NOTE_TAGS, payload: data.updatedCard });
    dispatch({ type: UPDATE_CARD_IN_POST, payload: data.updatedCard });
  } catch (error) {
    console.log(error.message);
  }
};
export const getCardTags = (variables) => async (dispatch) => {
  try {
    const { data } = await api.getCardTags(variables);
    console.log(`data from getCardTags @ card_actions.js`, data);
    dispatch({ type: GET_CARD_TAGS, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
// export const createCard = (variables) => async (dispatch) => {
//   try {
//     const { data } = await api.createCard(variables);
//     dispatch({ type: CREATE_CARD, payload: data.cardInfo });
//     if (data.success) {
//       message.success("Card was Created");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const deleteCard = (folderId) => async (dispatch) => {
//   try {
//     api.deleteCard(folderId);
//     dispatch({ type: DELETE_FOLDER, payload: folderId });
//     dispatch({ type: MOVE_TO_TRASH_FOLDER, payload: folderId });
//     message.success("Folder was deleted");
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export const createCardInList = (variables) => async (dispatch) => {
//   try {
//     const { data } = await api.createCardInList(variables);
//     console.log(`data from createCardInList`, data);
//     dispatch({ type: CREATE_CARD_IN_LIST, payload: data });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
// export const removeCardFromList = (variables) => async (dispatch) => {
//   try {
//     const { data } = await api.removeCardFromList(variables);
//     console.log(`data from removeCardFromList`, data);
//     dispatch({ type: REMOVE_CARD_FROM_LIST, payload: data });
//   } catch (error) {
//     console.log(error.message);
//   }
// };
