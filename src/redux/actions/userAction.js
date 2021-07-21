import { SET_USER } from "../types";

export const actionSetUser = (payload) => (dispatch) =>
  dispatch({
    type: SET_USER,
    payload,
  });
