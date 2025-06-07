import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAdditionalSetupStore = create((set, get) => ({
  resetSessionStatus: async () => {
    set({
      addSessionStatus: STATUS.NOT_STARTED,
      updateSessionStatus: STATUS.NOT_STARTED,
      deleteSessionStatus: STATUS.NOT_STARTED,
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

  getSessionAction: async (payload) => {
    set({ getSessionStatus: STATUS.FETCHING });
    const { data } = await apis.getSessionApi(payload);
    if (data?.action === true) {
      set({
        allSessions: data.data,
        getSessionStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSessionStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addSessionAction: async (payload) => {
    set({ addSessionStatus: STATUS.FETCHING });
    const { data } = await apis.addSessionApi(payload);
    if (data?.action === true) {
      const prev = get().allSessions;
      set({
        allSessions: concat(prev, data.data),
        addSessionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addSessionStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateSessionAction: async (payload) => {
    set({ updateSessionStatus: STATUS.FETCHING });
    const { data } = await apis.putSessionApi(payload);
    if (data?.action === true) {
      const prev = get().allSessions;
      set({
        allSessions: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateSessionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSessionStatus: STATUS.FAILED });
    }
  },

  deleteSessionAction: async (payload) => {
    set({ deleteSessionStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSessionApi(payload);
    if (data?.action === true) {
      const prev = get().allSessions;
      set({
        allSessions: filter(prev, (d) => d.id !== payload),
        deleteSessionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSessionStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
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
  getHouseOnlineAction: async (payload) => {
    set({ getHouseOnlineStatus: STATUS.FETCHING });
    const { data } = await apis.getHouseoOnlineApi(payload);
    if (data?.action === true) {
      set({
        allHousesOnline: data.data,
        getHouseOnlineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getHouseOnlineStatus: STATUS.FAILED });
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

  resetdesignationStatus: async () => {
    set({
      adddesignationStatus: STATUS.NOT_STARTED,
      updatedesignationStatus: STATUS.NOT_STARTED,
      deletedesignationStatus: STATUS.NOT_STARTED,
    });
  },
  getdesignationAction: async (payload) => {
    set({ getdesignationStatus: STATUS.FETCHING });
    const { data } = await apis.getdesignationApi(payload);
    if (data?.action === true) {
      set({
        alldesignations: data.data,
        getdesignationStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getdesignationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  adddesignationAction: async (payload) => {
    set({ adddesignationStatus: STATUS.FETCHING });
    const { data } = await apis.adddesignationApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignations;
      set({
        alldesignations: concat(prev, data.data),
        adddesignationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ adddesignationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updatedesignationAction: async (payload) => {
    set({ updatedesignationStatus: STATUS.FETCHING });
    const { data } = await apis.putdesignationApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignations;
      set({
        alldesignations: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updatedesignationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updatedesignationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deletedesignationAction: async (payload) => {
    set({ deletedesignationStatus: STATUS.FETCHING });
    const { data } = await apis.deletedesignationApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignations;
      set({
        alldesignations: filter(prev, (d) => d.id !== payload),
        deletedesignationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deletedesignationStatus: STATUS.FAILED });
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

  // shift

  addShiftAction: async (payload) => {
    set({ addShiftStatus: STATUS.FETCHING });
    const { data } = await apis.addShiftApi(payload);
    if (data?.action === true) {
      const prev = get().allShifts;
      set({
        allShifts: concat(prev, data.data),
        addShiftStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addShiftStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deleteShiftAction: async (payload) => {
    set({ deleteShiftStatus: STATUS.FETCHING });
    const { data } = await apis.deleteShiftApi(payload);
    if (data?.action === true) {
      const prev = get().allShifts;
      set({
        allShifts: filter(prev, (d) => d.id !== payload),
        deleteShiftStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteShiftStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getShiftAction: async (payload) => {
    set({ getShiftStatus: STATUS.FETCHING });
    const sessionMasterId = getLocalStorageItem("sessionMasterId");
    const payloadData = {
      sessionMasterId,
    };
    const { data } = await apis.getShiftApi(payloadData);
    if (data?.action === true) {
      set({
        allShifts: data.data,
        getShiftStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getShiftStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getShiftOnlineAction: async (payload) => {
    set({ getShiftOnlineStatus: STATUS.FETCHING });
    const { data } = await apis.getShiftOnlineApi(payload);
    if (data?.action === true) {
      set({
        allShiftsOnline: data.data,
        getShiftOnlineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getShiftOnlineStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getRouteByIdAction: async (payload) => {
    set({ getShiftByIdStatus: STATUS.FETCHING });
    const { data } = await apis.getShiftByIdApi(payload);
    if (data?.action === true) {
      set({
        SingleRouteDetail: data.data,
        getShiftByIdStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getShiftByIdStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateShiftAction: async (payload) => {
    set({ updateShiftStatus: STATUS.FETCHING });
    const { data } = await apis.putshiftApi(payload);
    if (data?.action === true) {
      const prev = get().allShifts;
      set({
        allShifts: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateShiftStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateShiftStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  resetShiftStatus: async () => {
    set({
      addShiftStatus: STATUS.NOT_STARTED,
      updateShiftStatus: STATUS.NOT_STARTED,
      deleteShiftStatus: STATUS.NOT_STARTED,
    });
  },

  //super admin

  getdesignationSuperAdminAction: async (payload) => {
    set({ getdesignationSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.getdesignationSuperAdminApi(payload);
    if (data?.action === true) {
      set({
        alldesignationsSuperAdmin: data.data,
        getdesignationSuperAdminStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getdesignationSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deletedesignationSuperAdminAction: async (payload) => {
    set({ deletedesignationSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.deletedesignationSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignationsSuperAdmin;
      set({
        alldesignationsSuperAdmin: filter(prev, (d) => d.id !== payload),
        deletedesignationSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deletedesignationSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  resetdesignationSuperAdminStatus: async () => {
    set({
      adddesignationSuperAdminStatus: STATUS.NOT_STARTED,
      updatedesignationSuperAdminStatus: STATUS.NOT_STARTED,
      deletedesignationSuperAdminStatus: STATUS.NOT_STARTED,
    });
  },

  adddesignationSuperAdminAction: async (payload) => {
    set({ adddesignationSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.adddesignationSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignationsSuperAdmin;
      set({
        alldesignationsSuperAdmin: concat(prev, data.data),
        adddesignationSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ adddesignationSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updatedesignationSuperAdminAction: async (payload) => {
    set({ updatedesignationSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.putdesignationSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().alldesignationsSuperAdmin;
      set({
        alldesignationsSuperAdmin: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updatedesignationSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updatedesignationSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
}));
