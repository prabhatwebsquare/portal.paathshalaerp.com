// redux/sagas/catalogSaga.js
import { call, put, takeEvery } from "redux-saga/effects";

import {
  fetchCatalogLimitFailure,
  fetchCatalogLimitSuccess,
  fetchCatalogLimitRequest,
} from "./catalogSlice";
import { fetchCatalogLimitApi } from "../pages/api/catalog";

function* handleFetchCatalogLimit({ payload }) {
  try {
    const data = yield call(fetchCatalogLimitApi, payload);
    yield put(fetchCatalogLimitSuccess(data));
  } catch (error) {
    yield put(fetchCatalogLimitFailure(error.message));
  }
}

export default function* catalogSaga() {
  yield takeEvery(fetchCatalogLimitRequest.type, handleFetchCatalogLimit);
}
