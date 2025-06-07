// redux/catalogSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allCatalogLimit: [],
  status: "idle",
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    fetchCatalogLimitRequest: (state) => {
      state.status = "loading";
    },
    fetchCatalogLimitSuccess: (state, action) => {
      state.status = "succeeded";
      state.allCatalogLimit = action.payload;
    },
    fetchCatalogLimitFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  fetchCatalogLimitRequest,
  fetchCatalogLimitSuccess,
  fetchCatalogLimitFailure,
} = catalogSlice.actions;

export default catalogSlice.reducer;
