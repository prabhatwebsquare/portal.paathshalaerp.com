import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useFeesSetupStore = create((set, get) => ({
  resetFeesNameStatus: async () => {
    set({
      addFeesNameStatus: STATUS.NOT_STARTED,
      updateFeesNameStatus: STATUS.NOT_STARTED,
      deleteFeesNameStatus: STATUS.NOT_STARTED,
    });
  },


  resetFeesGroupStatus: async () => {
    set({
      addFeesGroupStatus: STATUS.NOT_STARTED,
      updateFeesGroupStatus: STATUS.NOT_STARTED,
      deleteFeesGroupStatus: STATUS.NOT_STARTED,
    });
  },

  resetAssignFeesStatus: async () => {
    set({
      addAssignFeesStatus: STATUS.NOT_STARTED,
      updateAssignFeesStatus: STATUS.NOT_STARTED,
      deleteAssignFeesStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetAssignFees: async () => {
    set({
      getAssignFeesStatus: STATUS.NOT_STARTED,
      allAssignFees: [],
    });
  },

  resetDiscountMasterStatus: async () => {
    set({
      addDiscountMasterStatus: STATUS.NOT_STARTED,
      updateDiscountMasterStatus: STATUS.NOT_STARTED,
      deleteDiscountMasterStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetDiscountMaster: async () => {
    set({
      getDiscountMasterStatus: STATUS.NOT_STARTED,
      allDiscountMasters: [],
    });
  },

  resetBrocherFeesStatus: async () => {
    set({
      editBrocherFeesStatus: STATUS.NOT_STARTED,
    });
  },

  reset: async () => {
    set({
      getAssignFeesStatus: STATUS.NOT_STARTED,
    });
  },

  getFeesNameAction: async (payload) => {
    set({ getFeesNameStatus: STATUS.FETCHING });
    const { data } = await apis.getFeesNameApi(payload);
    if (data?.action === true) {
      set({
        allFeesNames: data.data,
        getFeesNameStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesNameStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  addFeesNameAction: async (payload) => {
    set({ addFeesNameStatus: STATUS.FETCHING });
    const { data } = await apis.addFeesNameApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesNames;
      set({
        allFeesNames: concat(prev, data.data),
        addFeesNameStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ addFeesNameStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  
  updateFeesNameAction: async (payload) => {
    set({ updateFeesNameStatus: STATUS.FETCHING });
    const { data } = await apis.putFeesNameApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesNames;
      set({
        allFeesNames: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateFeesNameStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ updateFeesNameStatus: STATUS.FAILED });
    }
  },
  resetGeneralSettingStatus: async () => {
    set({
      updateGeneralSettingsStatus: STATUS.NOT_STARTED,
      getGeneralSettingsStatus: STATUS.NOT_STARTED,
    });
  },
  updateGeneralSettingsAction: async (payload) => {
    set({ updateGeneralSettingsStatus: STATUS.FETCHING });
    const { data } = await apis.updateGeneralSettingsApi(payload);
    if (data?.action === true) {
      set({
        updateGeneralSettingsStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ updateGeneralSettingsStatus: STATUS.FAILED });
    }
  },
  
  getGeneralSettingsAction: async () => {
    set({ getGeneralSettingsStatus: STATUS.FETCHING });
    const { data } = await apis.getGeneralSettingsApi();
    if (data?.action === true) {
      set({
        GeneralSettings: data.data,
        getGeneralSettingsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getGeneralSettingsStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },
  deleteFeesNameAction: async (payload) => {
    set({ deleteFeesNameStatus: STATUS.FETCHING });
    const { data } = await apis.deleteFeesNameApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesNames;
      set({
        allFeesNames: filter(prev, (d) => d.id !== payload),
        deleteFeesNameStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ deleteFeesNameStatus: STATUS.FAILED });
    }
  },

  getFeesGroupAction: async (payload) => {
    set({ getFeesGroupStatus: STATUS.FETCHING });
    const { data } = await apis.getFeesGroupApi(payload);
    if (data?.action === true) {
      set({
        allFeesGroups: data.data,
        getFeesGroupStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesGroupStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  addFeesGroupAction: async (payload) => {
    set({ addFeesGroupStatus: STATUS.FETCHING });
    const { data } = await apis.addFeesGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesGroups;
      set({
        allFeesGroups: concat(prev, data.data),
        addFeesGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ addFeesGroupStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  updateFeesGroupAction: async (payload) => {
    set({ updateFeesGroupStatus: STATUS.FETCHING });
    const { data } = await apis.putFeesGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesGroups;
      set({
        allFeesGroups: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateFeesGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ updateFeesGroupStatus: STATUS.FAILED });
    }
  },

  deleteFeesGroupAction: async (payload) => {
    set({ deleteFeesGroupStatus: STATUS.FETCHING });
    const { data } = await apis.deleteFeesGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesGroups;
      set({
        allFeesGroups: filter(prev, (d) => d.id !== payload),
        deleteFeesGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ deleteFeesGroupStatus: STATUS.FAILED });
    }
  },

  getAssignFeesAction: async (payload) => {
    set({ getAssignFeesStatus: STATUS.FETCHING });
    const { data } = await apis.getAssignFeesApi(payload);
    if (data?.action === true) {
      set({
        allAssignFees: data.data,
        getAssignFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAssignFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getAssignFeesOnlineAction: async (payload) => {
    set({ getAssignFeesStatus: STATUS.FETCHING });
    const { data } = await apis.getAssignFeesOnlineApi(payload);
    if (data?.action === true) {
      set({
        allAssignFees: data.data,
        getAssignFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAssignFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addAssignFeesAction: async (payload) => {
    set({ addAssignFeesStatus: STATUS.FETCHING });
    const { data } = await apis.addAssignFeesApi(payload);

    if (data?.action === true) {
      const prev = get().allAssignFees;
      set({
        allAssignFees: concat(prev, data.data),
        addAssignFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ addAssignFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateAssignFeesAction: async (payload) => {
    set({ updateAssignFeesStatus: STATUS.FETCHING });
    const { data } = await apis.putAssignFeesApi(payload);
    if (data?.action === true) {
      const prev = get().allAssignFees;
      set({
        allAssignFees: map(prev, (c) =>
          c.id === data.data[0].id ? data.data[0] : c
        ),
        updateAssignFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ updateAssignFeesStatus: STATUS.FAILED });
    }
  },

  deleteAssignFeesAction: async (payload) => {
    set({ deleteAssignFeesStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAssignFeesApi(payload);
    if (data?.action === true) {
      const prev = get().allAssignFees;
      set({
        allAssignFees: filter(prev, (d) => d.id !== payload),
        deleteAssignFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ deleteAssignFeesStatus: STATUS.FAILED });
    }
  },

  getDiscountMasterAction: async (payload) => {
    set({ getDiscountMasterStatus: STATUS.FETCHING });
    const sessionMasterId = getLocalStorageItem("sessionMasterId");
    const payloadData = {
      sessionMasterId,
      ...payload
    };
    const { data } = await apis.getDiscountMasterApi(payloadData);
    if (data?.action === true) {
      set({
        allDiscountMasters: data.data,
        getDiscountMasterStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDiscountMasterStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addDiscountMasterAction: async (payload) => {
    set({ addDiscountMasterStatus: STATUS.FETCHING });
    const { data } = await apis.addDiscountMasterApi(payload);
    if (data?.action === true) {
      const prev = get().allDiscountMasters;
      set({
        allDiscountMasters: concat(prev, data.data),
        addDiscountMasterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ addDiscountMasterStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  updateDiscountMasterAction: async (payload) => {
    set({ updateDiscountMasterStatus: STATUS.FETCHING });
    const { data } = await apis.putDiscountMasterApi(payload);
    if (data?.action === true) {
      const prev = get().allDiscountMasters;
      set({
        allDiscountMasters: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateDiscountMasterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ updateDiscountMasterStatus: STATUS.FAILED });
    }
  },

  deleteDiscountMasterAction: async (payload) => {
    set({ deleteDiscountMasterStatus: STATUS.FETCHING });
    const { data } = await apis.deleteDiscountMasterApi(payload);
    if (data?.action === true) {
      const prev = get().allDiscountMasters;
      set({
        allDiscountMasters: filter(prev, (d) => d.id !== payload),
        deleteDiscountMasterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ deleteDiscountMasterStatus: STATUS.FAILED });
    }
  },

  getBrocherFeesAction: async (payload) => {
    set({ getBrocherFeesStatus: STATUS.FETCHING });
    const sessionMasterId = getLocalStorageItem("sessionMasterId");
    const payloadData = {
      sessionMasterId,
      ...payload
    };
    const { data } = await apis.getBrocherFeesApi(payloadData);
    if (data?.action === true) {
      set({
        brocherFees: data.data,
        getBrocherFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBrocherFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  editBrocherFeesAction: async (payload) => {
    set({ editBrocherFeesStatus: STATUS.FETCHING });
    const { data } = await apis.editBrocherFeesApi(payload);
    if (data?.action === true) {
      set({
        brocherFees: data.data,
        editBrocherFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.message);
    } else {
      set({ editBrocherFeesStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },
}));
