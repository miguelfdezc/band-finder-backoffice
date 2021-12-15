import { put, takeLatest, all, call } from 'redux-saga/effects';
import { auth } from '../../config';
import { loginActionSuccess, logoutActionSuccess } from '../actions';
import { AuthActionTypes } from '../types/auth';

function* login(action) {
  try {
    const { email, password, history } = action;
    yield call(() => auth.signInWithEmailAndPassword(email, password));
    yield put(loginActionSuccess(auth.currentUser.uid));
    yield call(() => history.push('/'));
  } catch (error) {
    alert(`ERROR: ${error.message}`);
  }
}

function* logout() {
  try {
    yield call(() => auth.signOut());
    yield put(logoutActionSuccess());
  } catch (error) {
    alert(`ERROR: ${error.message}`);
  }
}

export function* authSaga() {
  yield all([
    takeLatest(AuthActionTypes.LOGIN, login),
    takeLatest(AuthActionTypes.LOGOUT, logout),
  ]);
}
