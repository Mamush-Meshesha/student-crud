/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchStudentsSuccess, fetchStudentsFailure, fetchStudentByIdSuccess, fetchStudentByIdFailure, updateStudentSuccess, updateStudentFailure, deleteStudentSuccess, deleteStudentFailure } from '../slices/studentSlice';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function* fetchStudentsSaga(): Generator<any, void, any> {
  try {
    const students = yield call(axios.get, `${API_URL}/api/student`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    yield put(fetchStudentsSuccess(students.data));
  } catch (error: any) {
    yield put(fetchStudentsFailure(error.message));
  }
}

function* fetchStudentByIdSaga(): Generator<any, void, any> {
  try {
    const res = yield call(axios.get, `${API_URL}/api/student/:id`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    yield put(fetchStudentByIdSuccess(res.data));
  } catch (error: any) {
    yield put(fetchStudentByIdFailure(error.message));
  }
}

function* updateStudentSaga(action: any): Generator<any, void, any> {
  try {
    const res = yield call(axios.put, `${API_URL}/api/student/:id`, action.payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    yield put(updateStudentSuccess(res.data));  
  } catch (error:any) {
    yield put(updateStudentFailure(error.message));
    
  }
}

function* deleteStudentSaga(action: any): Generator<any, void, any> {
  try {
    yield call(axios.delete, `${API_URL}/api/student/:id`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    yield put(deleteStudentSuccess(action.payload)); 
  } catch (error: any) {
    yield put(deleteStudentFailure(error.message));
  }
}


function* studentSaga(): Generator<any, void, any> {
  yield takeLatest('students/fetchStudentsStart', fetchStudentsSaga);
}

function* watchFetchStudentById() {
  yield takeLatest('students/fetchStudentByIdStart', fetchStudentByIdSaga);
}

function* watchUpdateStudent() {
  yield takeLatest('students/updateStudentStart', updateStudentSaga);
}

function* watchDeleteStudent() {
  yield takeLatest('students/deleteStudentStart', deleteStudentSaga);
} 


export { studentSaga, watchFetchStudentById, watchUpdateStudent, watchDeleteStudent };