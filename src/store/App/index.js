import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAppStore = create((set, get) => ({
  doRequestBulkMessageAction: async () => {
    set({ doRequestBulkMessageStatus: STATUS.FETCHING });
    const { data } = await apis.doRequestBulkMessageApi();
    if (data?.action === true) {
      set({
        doRequestBulkMessageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ doRequestBulkMessageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getBulkRequestMessageAction: async (payload) => {
    set({ getBulkRequestMessageStatus: STATUS.FETCHING });
    const { data } = await apis.getRequestBulkMessageApi(payload);
    if (data?.action === true) {
      set({
        bulkMessage: data.data,
        getBulkRequestMessageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ getBulkRequestMessageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  acceptBulkRequestAction: async (payload) => {
    set({ acceptBulkRequestStatus: STATUS.FETCHING });
    const { data } = await apis.acceptBulkRequestApi(payload);
    if (data?.action === true) {
      set({
        acceptBulkRequestStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ acceptBulkRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  demandMorePackageRequest: async (payload) => {
    set({ demandMorePackageStatus: STATUS.FETCHING });
    const { data } = await apis.demandMorePackageRequest(payload);
    if (data?.action === true) {
      set({
        demandMorePackageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ demandMorePackageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  resetNoticeBoardStatus: async () => {
    set({
      addNoticeBoardStatus: STATUS.NOT_STARTED,
      updateNoticeBoardStatus: STATUS.NOT_STARTED,
      deleteNoticeBoardStatus: STATUS.NOT_STARTED,
    });
  },
  resetMessageStatus: async () => {
    set({
      addMessageStatus: STATUS.NOT_STARTED,
      updateMessageStatus: STATUS.NOT_STARTED,
      deleteMessageStatus: STATUS.NOT_STARTED,
    });
  },

  getNoticeBoardAction: async (payload) => {
    set({ getNoticeBoardStatus: STATUS.FETCHING });
    const { data } = await apis.getNoticeBoardApi(payload);
    if (data?.action === true) {
      set({
        allNoticeBoards: data.data,
        getNoticeBoardStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getNoticeBoardStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getTeachNoticeBoardAction: async (payload) => {
    set({ getTeachNoticeBoardStatus: STATUS.FETCHING });
    const { data } = await apis.getTeachNoticeBoardApi(payload);
    if (data?.action === true) {
      set({
        allTeachNoticeBoards: data.data,
        getTeachNoticeBoardStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getTeachNoticeBoardStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addNoticeBoardAction: async (payload) => {
    set({ addNoticeBoardStatus: STATUS.FETCHING });
    const { data } = await apis.addNoticeBoardApi(payload);
    if (data?.action === true) {
      const prev = get().allNoticeBoards;
      set({
        allNoticeBoards: [data.data, ...prev],
        addNoticeBoardStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addNoticeBoardStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateNoticeBoardAction: async (payload) => {
    set({ updateNoticeBoardStatus: STATUS.FETCHING });
    const { data } = await apis.putNoticeBoardApi(payload);
    if (data?.action === true) {
      set({
        updateNoticeBoardStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateNoticeBoardStatus: STATUS.FAILED });
    }
  },

  deleteNoticeBoardAction: async (payload, type) => {
    set({ deleteNoticeBoardStatus: STATUS.FETCHING });
    const { data } = await apis.deleteNoticeBoardApi(payload);
    if (data?.action === true) {
      const prev = get().allNoticeBoards;
      if (type === "Student") {
        set({ allNoticeBoards: filter(prev, (d) => d.id !== payload) });
      }
      else {
        set({ allTeachNoticeBoards: filter(prev, (d) => d.id !== payload) });
      }
      set({
        deleteNoticeBoardStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteNoticeBoardStatus: STATUS.FAILED });
    }
  },

  getMessageAction: async (payload) => {
    set({ getMessageStatus: STATUS.FETCHING });
    const { data } = await apis.getMessageApi(payload);
    if (data?.action === true) {
      set({
        allMessages: data.data,
        getMessageStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMessageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getTeachMessageAction: async (payload) => {
    set({ getTeachMessageStatus: STATUS.FETCHING });
    const { data } = await apis.getTeachMessageApi(payload);
    if (data?.action === true) {
      set({
        allTeachMessages: data.data,
        getTeachMessageStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getTeachMessageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addMessageAction: async (payload) => {
    set({ addMessageStatus: STATUS.FETCHING });
    const { data } = await apis.addMessageApi(payload);
    if (data?.action === true) {
      const prev = get().allMessages;
      const teacherPrev = get().allTeachMessages;
      set({
        allMessages: [],
        allTeachMessages: [],
        addMessageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addMessageStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateMessageAction: async (payload) => {
    set({ updateMessageStatus: STATUS.FETCHING });
    const { data } = await apis.putMessageApi(payload);
    if (data?.action === true) {
      const prev = get().allMessages;
      set({
        allMessages: [],
        updateMessageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateMessageStatus: STATUS.FAILED });
    }
  },

  deleteMessageAction: async (payload) => {
    set({ deleteMessageStatus: STATUS.FETCHING });
    const { data } = await apis.deleteMessageApi(payload);
    if (data?.action === true) {
      const prev = get().allMessages;
      set({
        allMessages: [],
        deleteMessageStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteMessageStatus: STATUS.FAILED });
    }
  },
  addColorCodeAction: async (payload) => {
    set({ addColorCodeStatus: STATUS.FETCHING });
    const { data } = await apis.addColorCodeApi(payload);
    if (data?.action === true) {
      set({
        allColor: data.data,
        addColorCodeStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addColorCodeStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },


  // Bulk Message Request
  getMoreMessageRequestAction: async (payload) => {
    set({ getMoreMessageRequestStatus: STATUS.FETCHING });
    const { data } = await apis.getMoretBulkMessageApi(payload);
    if (data?.action === true) {
      set({
        MoreMessage: data.data,
        getMoreMessageRequestStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMoreMessageRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateMoreMessageRequestAction: async (payload) => {
    set({ updateMoreMessageRequestStatus: STATUS.FETCHING });
    const { data } = await apis.putMoretBulkMessageApi(payload);
    if (data?.action === true) {
      const prev = get().MoreMessage;
      set({
        MoreMessage: filter(prev, (d) => d.id !== payload),
        updateMoreMessageRequestStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateMoreMessageRequestStatus: STATUS.FAILED });
    }
  },
}));
