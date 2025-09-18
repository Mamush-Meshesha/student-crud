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
    // Mirror the auth register flow as requested
    const birthISO = action.payload?.dateOfBirth
      ? new Date(`${action.payload.dateOfBirth}T00:00:00Z`).toISOString()
      : undefined;
    const payload = {
      ...action.payload,
      // map to backend names
      academicYear: action.payload?.year,
      birthDate: birthISO,
      // Some backends accept department instead of major; include both
      department: action.payload?.major ?? action.payload?.department,
      major: action.payload?.major,
      phone: action.payload?.phone,
      address: action.payload?.address,
      gpa: action.payload?.gpa,
      status: action.payload?.status,
    };
    const res = yield call(axios.post, `${API_URL}/api/auth/register`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    yield put(registerSuccess(res.data));

    // Also push into students store so list updates immediately
    const server = res.data as any;
    const created = {
      id: server?.id ?? server?.user?.id ?? String(Date.now()),
      ...action.payload,
      major: action.payload?.major ?? server?.major ?? server?.department ?? payload?.department ?? '',
    };
    yield put(createStudentSuccess(created));

    // Persist profile fields (e.g., major) if register endpoint didn't save them
    const studentId = server?.user?.id ?? server?.id;
    if (studentId) {
      yield put({
        type: 'students/updateStudentRequest',
        payload: { id: String(studentId), data: action.payload },
      });
    }
  } catch (error: any) {
    yield put(registerFailure(error.message));
    yield put(createStudentFailure(error.message));
  }
}

function* updateStudentSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const birthISO = (data as any)?.dateOfBirth
      ? new Date(`${(data as any).dateOfBirth}T00:00:00Z`).toISOString()
      : undefined;
    const payload: Record<string, unknown> = {
      ...data,
      // map to backend names
      academicYear: (data as any)?.year,
      birthDate: birthISO,
      department: data?.major,
      major: data?.major,
      phone: data?.phone,
      address: (data as any)?.address,
      gpa: data?.gpa,
      status: data?.status,
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
  // Match the action defined in slice: updateStudentRequest
  yield takeLatest("students/updateStudentRequest", updateStudentSaga);
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
