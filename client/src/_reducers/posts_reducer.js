import { FETCH_ALL_POSTS } from "../_actions/types";


export default function (posts = [], action) {
  switch (action.type) {
    case FETCH_ALL_POSTS: {
      console.log(`action.payload reducer receives`, action.payload);
      return action.payload;
    }

    case "CREATE":
      return posts;

    default:
      return posts;
  }
}
