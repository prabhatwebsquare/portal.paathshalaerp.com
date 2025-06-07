import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useClientStore = create((set, get) => ({
  resetClientRegStatus: async () => {
    set({
      addClientRegStatus: STATUS.NOT_STARTED,
      updateClientRegStatus: STATUS.NOT_STARTED,
      deleteClientRegStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetClientStatus: async () => {
    set({
      getClientRegStatus: STATUS.NOT_STARTED,
      allClientRegs: null,
    });
  },

  resetAppRequestStatus: async () => {
    set({
      addAppRequestStatus: STATUS.NOT_STARTED,
      deleteAppRequestStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetAppRequestStatus: async () => {
    set({
      getAppRequestStatus: STATUS.NOT_STARTED,
      allAppRequests: [],
    });
  },

  resetAppClientStatus: async () => {
    set({
      addAppClientStatus: STATUS.NOT_STARTED,
      updateAppClientStatus: STATUS.NOT_STARTED,
      deleteAppClientStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetAppClientStatus: async () => {
    set({
      getAppClientStatus: STATUS.NOT_STARTED,
      allAppClients: [],
    });
  },

  resetHouseStatus: async () => {
    set({
      addHouseStatus: STATUS.NOT_STARTED,
      updateHouseStatus: STATUS.NOT_STARTED,
      deleteHouseStatus: STATUS.NOT_STARTED,
    });
  },

  resetBankStatus: async () => {
    set({
      addBankStatus: STATUS.NOT_STARTED,
      updateBankStatus: STATUS.NOT_STARTED,
      deleteBankStatus: STATUS.NOT_STARTED,
    });
  },

  reset: async () => {
    set({
      getClassStatus: STATUS.NOT_STARTED,
      getStreamStatus: STATUS.NOT_STARTED,
      getSectionStatus: STATUS.NOT_STARTED,
    });
  },

  updateExpiryDateAction: async (payload) => {
    set({ updateExpiryDateStatus: STATUS.FETCHING });
    const { data } = await apis.updateExpiryDateApi(payload);
    if (data?.action === true) {
      const prev = get().updateExpiryDate;
      set({
        updateExpiryDate: concat(prev, data.data),
        updateExpiryDateStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateExpiryDateStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getClientRegAction: async (payload) => {
    set({ getClientRegStatus: STATUS.FETCHING });
    const { data } = await apis.getClientRegApi(payload);
    if (data?.action === true) {
      set({
        allClientRegs: data,
        getClientRegStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClientRegStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addClientRegAction: async (payload) => {
    set({ addClientRegStatus: STATUS.FETCHING });
    const { data } = await apis.addClientRegApi(payload);
    if (data?.action === true) {
      const prev = get().allClientRegs;
      set({
        allClientRegs: { ...prev, data: [...prev.data, data.data] },
        addClientRegStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addClientRegStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateClientRegAction: async (payload) => {
    set({ updateClientRegStatus: STATUS.FETCHING });
    const { data } = await apis.putClientRegApi(payload);
    if (data?.action === true) {
      const prev = get().allClientRegs;
      set({
        allClientRegs: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateClientRegStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateClientRegStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteClientRegAction: async (payload) => {
    set({ deleteClientRegStatus: STATUS.FETCHING });
    const { data } = await apis.deleteClientRegApi(payload);
    if (data?.action === true) {
      const prev = get().allClientRegs;
      set({
        allClientRegs: filter(prev, (d) => d.id !== payload),
        deleteClientRegStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteClientRegStatus: STATUS.FAILED });
    }
  },

  getAppRequestAction: async (payload) => {
    set({ getAppRequestStatus: STATUS.FETCHING });
    const { data } = await apis.getAppRequestApi(payload);
    if (data?.action === true) {
      set({
        allAppRequests: data.data,
        getAppRequestStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAppRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getOrderRequestAction: async (payload) => {
    set({ getOrderRequestStatus: STATUS.FETCHING });
    const { data } = await apis.getOrderRequestApi(payload);
    if (data?.action === true) {
      set({
        allOrderRequests: data.data,
        getOrderRequestStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getOrderRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  resetGetOrderRequestStatus: async () => {
    set({
      getOrderRequestStatus: STATUS.NOT_STARTED,
      allOrderRequests: [],
    });
  },
  addAppRequestAction: async (payload) => {
    set({ addAppRequestStatus: STATUS.FETCHING });
    const { data } = await apis.addAppRequestApi(payload);
    if (data?.action === true) {
      set({ addAppRequestStatus: STATUS.SUCCESS });
      SuccessAlert(data?.message);
    } else {
      set({ addAppRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteAppRequestAction: async (payload) => {
    set({ deleteAppRequestStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAppRequestApi(payload);
    if (data?.action === true) {
      const prev = get().allAppRequests;
      set({
        allAppRequests: filter(prev, (d) => d.id !== payload),
        deleteAppRequestStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteAppRequestStatus: STATUS.FAILED });
    }
  },

  getAppClientAction: async (payload) => {
    set({ getAppClientStatus: STATUS.FETCHING });
    const { data } = await apis.getAppClientApi(payload);
    if (data?.action === true) {
      set({
        allAppClients: data.data,
        getAppClientStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAppClientStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addAppClientAction: async (payload) => {
    set({ addAppClientStatus: STATUS.FETCHING });
    const { data } = await apis.addAppClientApi(payload);
    if (data?.action === true) {
      const prev = get().allAppClients;
      set({
        allAppClients: concat(prev, data.data),
        addAppClientStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAppClientStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteAppClientAction: async (payload) => {
    set({ deleteAppClientStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAppClientApi(payload);
    if (data?.action === true) {
      const prev = get().allAppClients;
      set({
        allAppClients: filter(prev, (d) => d.id !== payload),
        deleteAppClientStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteAppClientStatus: STATUS.FAILED });
    }
  },

  getHouseAction: async (payload) => {
    set({ getHouseStatus: STATUS.FETCHING });
    const { data } = await apis.getHouseApi(payload);
    if (data?.action === true) {
      set({
        allHouses: data.data,
        getHouseStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getHouseStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addHouseAction: async (payload) => {
    set({ addHouseStatus: STATUS.FETCHING });
    const { data } = await apis.addHouseApi(payload);
    if (data?.action === true) {
      const prev = get().allHouses;
      set({
        allHouses: concat(prev, data.data),
        addHouseStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addHouseStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateHouseAction: async (payload) => {
    set({ updateHouseStatus: STATUS.FETCHING });
    const { data } = await apis.putHouseApi(payload);
    if (data?.action === true) {
      const prev = get().allHouses;
      set({
        allHouses: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateHouseStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateHouseStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteHouseAction: async (payload) => {
    set({ deleteHouseStatus: STATUS.FETCHING });
    const { data } = await apis.deleteHouseApi(payload);
    if (data?.action === true) {
      const prev = get().allHouses;
      set({
        allHouses: filter(prev, (d) => d.id !== payload),
        deleteHouseStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteHouseStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getBankAction: async (payload) => {
    set({ getBankStatus: STATUS.FETCHING });
    const { data } = await apis.getBankApi(payload);
    if (data?.action === true) {
      set({
        allBanks: data.data,
        getBankStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addBankAction: async (payload) => {
    set({ addBankStatus: STATUS.FETCHING });
    const { data } = await apis.addBankApi(payload);
    if (data?.action === true) {
      const prev = get().allBanks;
      set({
        allBanks: concat(prev, data.data),
        addBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateBankAction: async (payload) => {
    set({ updateBankStatus: STATUS.FETCHING });
    const { data } = await apis.putBankApi(payload);
    if (data?.action === true) {
      const prev = get().allBanks;
      set({
        allBanks: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteBankAction: async (payload) => {
    set({ deleteBankStatus: STATUS.FETCHING });
    const { data } = await apis.deleteBankApi(payload);
    if (data?.action === true) {
      const prev = get().allBanks;
      set({
        allBanks: filter(prev, (d) => d.id !== payload),
        deleteBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getClassDocumentAction: async (payload) => {
    set({ getClassDocumentStatus: STATUS.FETCHING });
    const { data } = await apis.getClassDocumentApi(payload);
    if (data?.action === true) {
      set({
        allClassDocuments: data.data,
        getClassDocumentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassDocumentStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addClassDocumentAction: async (payload) => {
    set({ addClassDocumentStatus: STATUS.FETCHING });
    const { data } = await apis.addClassDocumentApi(payload);
    if (data?.action === true) {
      const prev = get().allClassDocuments;
      set({
        allClassDocuments: concat(prev, data.data),
        addClassDocumentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addClassDocumentStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateClassDocumentAction: async (payload) => {
    set({ updateClassDocumentStatus: STATUS.FETCHING });
    const { data } = await apis.putClassDocumentApi(payload);
    if (data?.action === true) {
      const prev = get().allClassDocuments;
      set({
        allClassDocuments: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateClassDocumentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateClassDocumentStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteBankAction: async (payload) => {
    set({ deleteBankStatus: STATUS.FETCHING });
    const { data } = await apis.deleteBankApi(payload);
    if (data?.action === true) {
      const prev = get().allBanks;
      set({
        allBanks: filter(prev, (d) => d.id !== payload),
        deleteBankStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteBankStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  ApproveWebRequestAction: async (payload) => {
    set({ ApproveWebRequestStatus: STATUS.FETCHING });
    const { data } = await apis.approveWebRequestApi(payload);
    if (data?.action === true) {
      set({
        ApproveWebRequestStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ ApproveWebRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  ApproveAppRequestAction: async (payload) => {
    set({ ApproveAppRequestStatus: STATUS.FETCHING });
    const { data } = await apis.approveAppRequestApi(payload);
    if (data?.action === true) {
      set({
        ApproveAppRequestStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ ApproveAppRequestStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  makePaymentAction: async (payload) => {
    set({ makePaymentStatus: STATUS.FETCHING });
    const { data } = await apis.makePaymentApi(payload);
    if (data?.action === true) {
      set({
        makePaymentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ makePaymentStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
}));
