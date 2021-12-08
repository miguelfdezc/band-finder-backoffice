import { AuthActionTypes, AuthDefaultState } from '../types/auth';

export const authReducer = (state = AuthDefaultState(), action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_SUCCESS:
      return { ...state, authUser: action.data };
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        authUser: AuthDefaultState.authUser,
      };
    default:
      return state;
  }
};
