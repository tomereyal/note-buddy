import {
  GET_TAGS,
  CREATE_TAG,
  DELETE_TAG,
  UPDATE_TAG,
} from "../_actions/types";

export default function (tags = [], action) {
  switch (action.type) {
    case GET_TAGS:
      return action.payload;
    case CREATE_TAG:
      return [...tags, action.payload];
    case DELETE_TAG:
      return tags;
    case UPDATE_TAG:
      return tags;
    default:
      return tags;
  }
}
