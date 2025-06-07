import { createSelector } from "@reduxjs/toolkit";

export const selectAllCatalogLimit = (state) => state.catalog.allCatalogLimit;

export const selectCatalogByType = (type) =>
  createSelector(selectAllCatalogLimit, (catalogs) =>
    catalogs.filter((catalog) => catalog.catalogType === type)
  );
