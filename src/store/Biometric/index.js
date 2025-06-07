import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAdminBiometricStore = create((set, get) => ({

  searchSchoolAction: async (payload) => {
    set({ searchSchoolStatus: STATUS.FETCHING });
    const { data } = await apis.searchSchoolApi(payload);
    if (data?.action === true) {
      set({
        searchSchool: data.data,
        searchSchoolStatus: STATUS.SUCCESS,
      });
    } else {
      set({ searchSchoolStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  resetBiometricSearchStatus: async () => {
    set({
      searchSchoolStatus: STATUS.NOT_STARTED,
      searchSchool:[]
    });
  },

  resetBiometricStatus: async () => {
    set({
      addBiometricStatus: STATUS.NOT_STARTED,
      updateBiometricStatus: STATUS.NOT_STARTED,
      deleteBiometricStatus: STATUS.NOT_STARTED,
    });
  },

  getBiometricAction: async (payload) => {
    set({ getBiometricStatus: STATUS.FETCHING });
    const { data } = await apis.getBiometricApi(payload);
    if (data?.action === true) {
      set({
        allBiometricDevices: data.data,
        getBiometricStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBiometricStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addBiometricAction: async (payload) => {
    set({ addBiometricStatus: STATUS.FETCHING });
    const { data } = await apis.addBiometricApi(payload);
    if (data?.action === true) {
      const prev = get().allBiometricDevices;
      set({
 
        addBiometricStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addBiometricStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateBiometricAction: async (payload) => {
    set({ updateBiometricStatus: STATUS.FETCHING });
    const { data } = await apis.updateBiometricApi(payload);
    if (data?.action === true) {
      const prev = get().allBiometricDevices;
      set({
        allBiometricDevices: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateBiometricStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateBiometricStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteBiometricAction: async (payload) => {
    set({ deleteBiometricStatus: STATUS.FETCHING });
    const { data } = await apis.deleteBiometricApi(payload);
    if (data?.action === true) {
      const prev = get().allBiometricDevices;
      set({
        allBiometricDevices: filter(prev, (d) => d.id !== payload),
        deleteBiometricStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteBiometricStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
}));
