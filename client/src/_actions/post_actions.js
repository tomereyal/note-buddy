import * as api from "../api";
import { FETCH_ALL_POSTS} from "./types";

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts();
    // const action = { type: "FETCH_ALL", payload: [] } _______ I put action object interface directly in dispatch
    dispatch({ type: FETCH_ALL_POSTS, payload: data.blogs });
  } catch (error) {
    console.log(error.message);
  }
};


