import {
  EDIT_NOTE,
  CREATE_CARD,
  GET_CARDS,
  SAVE_NEW_NOTE_TAGS,
  SAVE_EXISTING_NOTE_TAGS,
  DELETE_CARD,
} from "../_actions/types";

export default function (cards = [], action) {
  switch (action.type) {
    case EDIT_NOTE:
      return cards.map((card) => {
        return card._id === action.payload._id ? action.payload : card;
      });
    case GET_CARDS:
      return action.payload;
    case DELETE_CARD:
      return cards.filter((card) => {
        return card._id !== action.payload;
      });
    case CREATE_CARD:
      console.log(`action.payload`, action.payload);
      return [...cards, action.payload];
    case SAVE_NEW_NOTE_TAGS:
      console.log(`action.payload`, action.payload);
    case SAVE_EXISTING_NOTE_TAGS:
      console.log(`action.payload`, action.payload);

      return action.payload;
    default:
      return cards;
  }
}
