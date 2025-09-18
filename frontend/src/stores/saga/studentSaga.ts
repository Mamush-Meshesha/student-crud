/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchStudentsSuccess,
  fetchStudentsFailure,
  fetchStudentByIdSuccess,
  fetchStudentByIdFailure,
  createStudentSuccess,
  createStudentFailure,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudentSuccess,
  deleteStudentFailure,
} from "../slices/studentSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function* fetchStudentsSaga(): Generator<any, void, any> {
  try {
    const students = yield call(axios.get, `${API_URL}/api/student`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    yield put(fetchStudentsSuccess(students.data));
  } catch (error: any) {
    yield put(fetchStudentsFailure(error.message));
  }
}

function* fetchStudentByIdSaga(action: any): Generator<any, void, any> {
  try {
    const id = action.payload;
    const res = yield call(axios.get, `${API_URL}/api/student/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    yield put(fetchStudentByIdSuccess(res.data));
  } catch (error: any) {
    yield put(fetchStudentByIdFailure(error.message));
  }
}

function* createStudentSaga(action: any): Generator<any, void, any> {
  try {
    const payload = {
      ...action.payload,
      // some backends expect 'department' instead of 'major'
      department: action.payload?.major,
    };
    // do not send confirmPassword to student API
    delete (payload as any).confirmPassword;
    const res = yield call(axios.post, `${API_URL}/api/student`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const created = {
      ...res.data,
      // Guarantee major exists in the object sent to the reducer
      major: res.data?.major ?? res.data?.department ?? payload.department ?? payload.major,
    };
    yield put(createStudentSuccess(created));
  } catch (error: any) {
    yield put(createStudentFailure(error.message));
  }
}

function* updateStudentSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const payload = {
      ...data,
      department: data?.major,
    };
    delete (payload as any).confirmPassword;
    const res = yield call(axios.put, `${API_URL}/api/student/${id}`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const updated = {
      ...res.data,
      major: res.data?.major ?? res.data?.department ?? payload.department ?? payload.major,
    };
    yield put(updateStudentSuccess(updated));
  } catch (error: any) {
    yield put(updateStudentFailure(error.message));
  }
}

function* deleteStudentSaga(action: any): Generator<any, void, any> {
  try {
    const id = action.payload;
    yield call(axios.delete, `${API_URL}/api/student/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    yield put(deleteStudentSuccess(id));
  } catch (error: any) {
    yield put(deleteStudentFailure(error.message));
  }
}

function* studentSaga(): Generator<any, void, any> {
  yield takeLatest("students/fetchStudentsStart", fetchStudentsSaga);
}

function* watchFetchStudentById() {
  yield takeLatest("students/fetchStudentByIdStart", fetchStudentByIdSaga);
}

function* watchUpdateStudent() {
  yield takeLatest("students/updateStudentStart", updateStudentSaga);
}

function* watchDeleteStudent() {
  yield takeLatest("students/deleteStudentStart", deleteStudentSaga);
}

function* watchCreateStudent() {
  yield takeLatest("students/createStudentRequest", createStudentSaga);
}

export {
  studentSaga,
  watchFetchStudentById,
  watchCreateStudent,
  watchUpdateStudent,
  watchDeleteStudent,
};
