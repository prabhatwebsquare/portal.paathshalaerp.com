// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { createWrapper } from "next-redux-wrapper";
import logger from "redux-logger";
import catalogSaga from "./Redux/sagas";
import catalogSlice from "./Redux/catalogSlice";

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: {
      catalog: catalogSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware, logger),
    devTools: process.env.NODE_ENV !== "production",
  });
  store.sagaTask = sagaMiddleware.run(catalogSaga);
  return store;
};

export const wrapper = createWrapper(makeStore);
