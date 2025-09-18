import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import studentReducer from "./slices/studentSlice";
import authReducer from "./slices/authSlice";
import rootSaga from "../stores/saga/index";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    students: studentReducer,
    auth: authReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
