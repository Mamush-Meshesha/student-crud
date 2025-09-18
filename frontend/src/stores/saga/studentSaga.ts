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
import { registerFailure, registerSuccess } from "../slices/authSlice";

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
      department: action.payload?.major ?? action.payload?.department,
    };
    const res = yield call(axios.post, `${API_URL}/api/auth/register`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    yield put(registerSuccess(res.data));

    const server = res.data as any;
    const created = {
      id: server?.id ?? server?.user?.id ?? String(Date.now()),
      ...action.payload,
      major: action.payload?.major ?? server?.major ?? server?.department ?? payload?.department ?? '',
    };
    yield put(createStudentSuccess(created));
  } catch (error: any) {
    yield put(registerFailure(error.message));
    yield put(createStudentFailure(error.message));
  }
}

function* updateStudentSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const payload: Record<string, unknown> = {
      ...data,
      department: data?.major,
    };
    delete (payload as any).confirmPassword;
    if (!data?.password) {
      delete (payload as any).password;
    }
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
