import { combineReducers } from 'redux';
import { authReducer } from './reducers/auth';
import { all } from 'redux-saga/effects';
import { authSaga } from './sagas/auth';

export const rootReducer = combineReducers({
  auth: authReducer,
});

export function* rootSaga() {
  yield all([authSaga()]);
}
