import {
  FETCH_ALL_POSTS,
  CREATE_POST,
  DELETE_POST,
  CREATE_SECTION_IN_POST,
} from "../_actions/types";

export default function (posts = [], action) {
  switch (action.type) {
    case FETCH_ALL_POSTS: {
      console.log(`action.payload reducer receives`, action.payload);
      return action.payload;
    }

    case DELETE_POST:
      console.log(`deleting from posts state this post:`, action.payload);
      return posts.filter(({ _id }) => _id !== action.payload);

    case CREATE_POST:
      console.log(`create-post action.payload`, action.payload);
      return [...posts, action.payload];

    case CREATE_SECTION_IN_POST:
      console.log(`action.payload`, action.payload);
      return posts.map((post) => {
        return post._id == action.payload._id ? action.payload : post;
      });

    default:
      return posts;
  }
}
