import { combineReducers } from "redux";
import user from "./user_reducer";
import posts from "./posts_reducer";
import folders from "./folders_reducer";
import settings from "./settings_reducer";
import tags from "./tags_reducer";

const rootReducer = combineReducers({
  user,
  posts,
  folders,
  settings,
  tags,
});

export default rootReducer;
