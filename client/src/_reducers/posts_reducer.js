import {
  FETCH_ALL_POSTS,
  CREATE_POST,
  DELETE_POST,
  CREATE_SECTION_IN_POST,
  SET_SECTION_BGC,
  SET_SECTION_PATTERN,
  SET_SECTION_TITLE,
  SET_POST_TITLE,
  REMOVE_SECTION_FROM_POST,
  CREATE_LIST_IN_SECTION,
  REMOVE_LIST_FROM_SECTION,
  SET_LIST_TITLE,
  CREATE_CARD_IN_LIST,
  REMOVE_CARD_FROM_LIST,
  EDIT_NOTE,
  UPDATE_CARD_IN_POST,
} from "../_actions/types";

export default function (posts = [], action) {
  switch (action.type) {
    case FETCH_ALL_POSTS: {
      return action.payload;
    }

    case DELETE_POST:
      return posts.filter((post) => {
        return post._id !== action.payload;
      });

    case CREATE_POST:
      return [...posts, action.payload];

    case SET_POST_TITLE:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });

    case CREATE_SECTION_IN_POST:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case REMOVE_SECTION_FROM_POST:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case SET_SECTION_BGC:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case SET_SECTION_PATTERN:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case SET_SECTION_TITLE:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case CREATE_LIST_IN_SECTION:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case REMOVE_LIST_FROM_SECTION:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case SET_LIST_TITLE:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case CREATE_CARD_IN_LIST:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case REMOVE_CARD_FROM_LIST:
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });
    case UPDATE_CARD_IN_POST:  
      const updatedCard = action.payload;
      const { location } = updatedCard;
      console.log(`action.payload`, action.payload);
      const post = posts.find((post) => post._id == location.post);
      const section = post.sections.find(
        (section) => section._id == location.section
      );
      const list = section.lists.find((list) => list._id == location.list);
      list.cards = list.cards.map((card) => {
        return card._id == updatedCard._id ? updatedCard : card;
      });
      console.log(`list`, list);
      return [...posts];

    default:
      return posts;
  }
}
