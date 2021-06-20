import * as api from "../api";
import { SET_GENERAL_CONFIG } from "./types";

export const setGeneralConfig = (generalConfig) => async (dispatch) => {
  try {
    dispatch({ type: SET_GENERAL_CONFIG, payload: generalConfig });
  } catch (error) {
    console.log(error.message);
  }
};
