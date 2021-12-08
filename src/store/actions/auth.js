import { AuthActionTypes } from '../types/auth';

export const loginAction = (email, password, history) => ({
  type: AuthActionTypes.LOGIN,
  email,
  password,
  history,
});

export const logoutAction = () => ({
  type: AuthActionTypes.LOGOUT,
});

export const loginActionSuccess = (data) => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  data,
});

export const logoutActionSuccess = () => ({
  type: AuthActionTypes.LOGOUT_SUCCESS,
});
