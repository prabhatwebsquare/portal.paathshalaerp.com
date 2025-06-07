import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { create } from "zustand";

export const useLoginStore = create((set, get) => ({
  resetStatus: async () => {
    set({
      userLoginStatus: STATUS.NOT_STARTED,
    });
  },

  resetLoginStatus: async () => {
    set({
      sysadminLoginStatus: STATUS.NOT_STARTED,
    });
  },
  resetDashboardStatus: async () => {
    set({
      dashboardStatus: STATUS.NOT_STARTED,
      fetchExtraDashboardInfoStatus: STATUS.NOT_STARTED,
    });
  },

  resetSessionStatus: async () => {
    set({
      defaultSessionStatus: STATUS.NOT_STARTED,
    });
  },

  resetPassStatus: async () => {
    set({
      changePassStatus: STATUS.NOT_STARTED,
    });
  },

  defaultSessionAction: async (payload) => {
    set({ defaultSessionStatus: STATUS.FETCHING });
    const { data } = await apis.defaultSessionApi(payload);
    if (data?.action === true) {
      set({
        defaultSession: data.data,
        defaultSessionStatus: STATUS.SUCCESS,
      });
    } else {
      set({ defaultSessionStatus: STATUS.FAILED });
    }
  },

  loginUserAction: async (payload) => {
    set({ userLoginStatus: STATUS.FETCHING });
    const { data } = await apis.loginApi(payload);
    if (data?.action === true) {
      set({
        userLogin: data,
        userLoginStatus: STATUS.SUCCESS,
      });
    } else {
      set({ userLoginStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },
  findMeAction: async () => {
    set({ userLoginStatus: STATUS.FETCHING });
    const { data } = await apis.findMeApi();
    if (data?.action === true) {
      set({
        userLogin: data,
        userLoginStatus: STATUS.SUCCESS,
      });
    } else {
      set({ userLoginStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },

  sysadminLoginAction: async (payload) => {
    set({ sysadminLoginStatus: STATUS.FETCHING });
    const { data } = await apis.sysadminLoginApi(payload);
    if (data?.action === true) {
      set({
        sysadminLogin: data,
        sysadminLoginStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ sysadminLoginStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },

  dashboardAction: async (payload) => {
    set({ dashboardStatus: STATUS.FETCHING });
    const data = await apis.dashboardApi(payload);
    if (data?.data?.action === true) {
      set({
        dashboard: data.data.data,
        dashboardStatus: STATUS.SUCCESS,
      });
    } else {
      set({ dashboardStatus: STATUS.FAILED });
    }
  },
  fetchExtraDashboardInfoAction: async (payload) => {
    set({ fetchExtraDashboardInfoStatus: STATUS.FETCHING });
    const data = await apis.fetchExtraDashboardInfoApi(payload);
    if (data?.data?.action === true) {
      set({
        extraDashboardInfo: data.data.data,
        fetchExtraDashboardInfoStatus: STATUS.SUCCESS,
      });
    } else {
      set({ fetchExtraDashboardInfoStatus: STATUS.FAILED });
    }
  },
  changePassAction: async (payload) => {
    set({ changePassStatus: STATUS.FETCHING });
    const data = await apis.changePassApi(payload);
    if (data?.data?.action === true) {
      set({
        changePass: data.data.data,
        changePassStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data?.message);
    } else {
      set({ changePassStatus: STATUS.FAILED });
      ErrorAlert(data.data?.message);
    }
  },

  updateNowAction: async (payload) => {
    set({ updateNowStatus: STATUS.FETCHING });
    const { data } = await apis.updateNowApi(payload);
    if (data?.action === true) {
      set({
        updateNowStatus: STATUS.SUCCESS,
      });
    } else {
      set({ updateNowStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },

  forgotPasswordAction: async (payload) => {
    set({ forgotPasswordStatus: STATUS.FETCHING });
    const { data } = await apis.forgotPasswordApi(payload);
    if (data?.action === true) {
      set({
        forgotPassword: data,
        forgotPasswordStatus: STATUS.SUCCESS,
      });
    } else {
      set({ forgotPasswordStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },
  resetPasswordAction: async (payload) => {
    set({ resetPasswordStatus: STATUS.FETCHING });
    const { data } = await apis.ResendVerificationApi(payload);
    if (data?.action === true) {
      set({
        ResendVerification: data,
        resetPasswordStatus: STATUS.SUCCESS,
      });
    } else {
      set({ resetPasswordStatus: STATUS.FAILED });
      ErrorAlert(data?.message || "Incorrect Credentials");
    }
  },
  resetForgotPasswordAction: async () => {
    set({ forgotPasswordStatus: STATUS.NOT_STARTED });
  },
}));
