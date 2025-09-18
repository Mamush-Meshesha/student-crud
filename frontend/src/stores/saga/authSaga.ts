/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} from '../slices/authSlice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function* handleLogin(action: PayloadAction<any>): Generator<any, void, any> {
  try {
    const response = yield call(axios.post, `${API_URL}/api/auth/login`, action.payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, 
      
    });
    yield put(loginSuccess(response.data));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action: PayloadAction<any>): Generator<any, void, any> {
  try {
   const res=  yield call(axios.post, `${API_URL}/api/auth/register`, action.payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    yield put(registerSuccess(res.data));
  } catch (error: any) {
    yield put(registerFailure(error.message));
  }
}

function* watchLogin() {
  yield takeLatest(loginStart.type, handleLogin);
}

function* watchRegister() {
  yield takeLatest(registerStart.type, handleRegister);
}
export {watchLogin, watchRegister};
