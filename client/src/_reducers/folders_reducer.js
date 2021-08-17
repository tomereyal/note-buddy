import {
  FETCH_ALL_FOLDERS,
  CREATE_FOLDER,
  DELETE_FOLDER,
  EDIT_FOLDER,
  ADD_POST_TO_FOLDER,
  DELETE_POST_FROM_FOLDER,
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
      return [...folders, action.payload];

    case EDIT_FOLDER:
      return folders.map((folder) => {
        return folder._id === action.payload._id ? action.payload : folder;
      });

    case DELETE_FOLDER:
      console.log(
        `DELETE_FOLDER: action.payload reducer receives`,
        action.payload
      );

      return folders.filter(({ _id }) => {
        return _id !== action.payload;
      });

    // case CREATE_POST_IN_FOLDER:
    //   return folders.map((folder) => {
    //     return folder._id == action.payload._id ? action.payload : folder;
    //   });

    case ADD_POST_TO_FOLDER:
      console.log(`ADD_POST_TO_FOLDER action.payload`, action.payload);
      const updatedFolder = action.payload.folder;
      return folders.map((folder) => {
        return folder._id == updatedFolder._id ? updatedFolder : folder;
      });

    case DELETE_POST_FROM_FOLDER:
      const newFolder = action.payload.folder;
      return folders.map((folder) => {
        return folder._id == newFolder._id ? newFolder : folder;
      });

    default:
      return folders;
  }
}
