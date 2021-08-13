import * as api from "../api";
import {
  EDIT_CARD,
  UPDATE_CARD_IN_POST,
  GET_CARDS,
  CREATE_CARD,
  DELETE_CARD,
  GET_CARD_TAGS,
  SAVE_NEW_NOTE_TAGS,
  SAVE_EXISTING_NOTE_TAGS,
} from "./types";
import { message } from "antd";

export const getCards = (variables) => async (dispatch) => {
  try {
    const { data } = await api.getCards(variables);

    dispatch({ type: GET_CARDS, payload: data.cards });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteCard = (cardId) => async (dispatch) => {
  try {
    const res = await api.deleteCard(cardId);
    console.log(`res`, res);
    dispatch({ type: DELETE_CARD, payload: cardId });
  } catch (error) {
    console.log(error.message);
  }
};

export const editCard = (variables) => async (dispatch) => {
  try {
    const { data } = await api.editCard(variables);
    dispatch({ type: EDIT_CARD, payload: data.cardInfo });
    return data.cardInfo;
    // dispatch({ type: UPDATE_CARD_IN_POST, payload: data.cardInfo });
  } catch (error) {
    console.log(error.message);
  }
};
export const saveNewNoteTags = (variables) => async (dispatch) => {
  try {
    const { data } = await api.saveNewNoteTags(variables);
    dispatch({ type: SAVE_NEW_NOTE_TAGS, payload: data.updatedCard });
    dispatch({ type: UPDATE_CARD_IN_POST, payload: data.updatedCard });
  } catch (error) {
    console.log(error.message);
  }
};
export const saveExistingNoteTags = (variables) => async (dispatch) => {
  try {
    const { data } = await api.saveExistingNoteTags(variables);
    dispatch({ type: SAVE_EXISTING_NOTE_TAGS, payload: data.updatedCard });
    dispatch({ type: UPDATE_CARD_IN_POST, payload: data.updatedCard });
  } catch (error) {
    console.log(error.message);
  }
};
export const getCardTags = (variables) => async (dispatch) => {
  try {
    const { data } = await api.getCardTags(variables);
    dispatch({ type: GET_CARD_TAGS, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};
export const createCard = (variables) => async (dispatch) => {
  try {
    const { data } = await api.createCard(variables);
    dispatch({ type: CREATE_CARD, payload: data.card });
    if (data.success) {
      message.success("Card was Created");
    }
    return data.card;
  } catch (error) {
    console.log(error.message);
  }
};

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
