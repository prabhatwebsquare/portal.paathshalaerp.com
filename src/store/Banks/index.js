import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAdminBankStore = create((set, get) => ({
  resetAdminBankStatus: async () => {
    set({
      addAdminBankStatus: STATUS.NOT_STARTED,
      updateAdminBankStatus: STATUS.NOT_STARTED,
      deleteAdminBankStatus: STATUS.NOT_STARTED,
    });
  },

  getAdminBankAction: async (payload) => {
    set({ getAdminBankStatus: STATUS.FETCHING });
    const { data } = await apis.getAdminBankApi(payload);
    if (data?.action === true) {
      set({
        allAdminBanks: data.data,
        getAdminBankStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAdminBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addAdminBankAction: async (payload) => {
    set({ addAdminBankStatus: STATUS.FETCHING });
    const { data } = await apis.addAdminBankApi(payload);
    if (data?.action === true) {
      const prev = get().allAdminBanks;
      set({
        allAdminBanks: concat(prev, data.data),
        addAdminBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAdminBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateAdminBankAction: async (payload) => {
    set({ updateAdminBankStatus: STATUS.FETCHING });
    const { data } = await apis.updateAdminBankApi(payload);
    if (data?.action === true) {
      const prev = get().allAdminBanks;
      set({
        allAdminBanks: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateAdminBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateAdminBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteAdminBankAction: async (payload) => {
    set({ deleteAdminBankStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAdminBankApi(payload);
    if (data?.action === true) {
      const prev = get().allAdminBanks;
      set({
        allAdminBanks: filter(prev, (d) => d.id !== payload),
        deleteAdminBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteAdminBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
}));
