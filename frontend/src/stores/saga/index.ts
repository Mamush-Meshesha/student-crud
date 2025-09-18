import { all } from 'redux-saga/effects';
import { studentSaga, watchDeleteStudent, watchFetchStudentById, watchUpdateStudent } from './studentSaga';
import { watchLogin, watchRegister } from './authSaga';

export default function* rootSaga() {
  yield all([
    watchDeleteStudent(),
    watchFetchStudentById(),
    watchLogin(),
    watchRegister(),
    watchUpdateStudent(),
    studentSaga(),
  ]);
}