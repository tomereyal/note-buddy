import {
  EDIT_NOTE,
  CREATE_CARD,
  GET_CARDS,
  SAVE_NEW_NOTE_TAGS,
  SAVE_EXISTING_NOTE_TAGS,
} from "../_actions/types";

export default function (cards = [], action) {
  switch (action.type) {
    case EDIT_NOTE:
      return action.payload;
    case GET_CARDS:
      console.log(`action.payload`, action.payload);
      return action.payload;
    case CREATE_CARD:
      console.log(`action.payload`, action.payload);
      return action.payload;
    case SAVE_NEW_NOTE_TAGS:
      console.log(`action.payload`, action.payload);
    case SAVE_EXISTING_NOTE_TAGS:
      console.log(`action.payload`, action.payload);

      return action.payload;
    default:
      return cards;
  }
}
