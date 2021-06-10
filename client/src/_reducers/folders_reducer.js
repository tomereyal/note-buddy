import {
  FETCH_ALL_FOLDERS,
  CREATE_FOLDER,
  DELETE_FOLDER,
  MOVE_TO_TRASH_FOLDER,
} from "../_actions/types";

export default function (folders = [], action) {
  switch (action.type) {
    case FETCH_ALL_FOLDERS:
      console.log(
        `FETCH_ALL_FOLDERS: action.payload reducer receives`,
        action.payload
      );
      return action.payload;

    case CREATE_FOLDER:
      console.log(
        `CREATE_FOLDER: action.payload reducer receives`,
        action.payload
      );
      return [...folders, action.payload];

    case DELETE_FOLDER:
      console.log(
        `DELETE_FOLDER: action.payload reducer receives`,
        action.payload
      );

      return folders.filter(({ _id }) => {
        return _id !== action.payload;
      });
    default:
      return folders;
  }
}
