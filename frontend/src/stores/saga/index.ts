import { all } from 'redux-saga/effects';
import { studentSaga, watchDeleteStudent, watchFetchStudentById, watchUpdateStudent, watchCreateStudent } from './studentSaga';
import { watchLogin, watchRegister } from './authSaga';

export default function* rootSaga() {
  yield all([
    watchDeleteStudent(),
    watchFetchStudentById(),
    watchCreateStudent(),
    watchLogin(),
    watchRegister(),
    watchUpdateStudent(),
    studentSaga(),
  ]);
}