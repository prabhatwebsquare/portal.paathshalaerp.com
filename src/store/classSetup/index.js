import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { getLocalStorageItem } from "@/utils/LocalStorage";
import { concat, filter, map } from "lodash";
import { useMemo } from "react";
import { create } from "zustand";

export const useClassSetupStore = create((set, get) => ({
  resetAllData: async () => {
    set({
      getClassDetailStatus: STATUS.NOT_STARTED,
      allClassDetails: {},
    });
  },

  resetStatus: async () => {
    set({
      addClassStatus: STATUS.NOT_STARTED,
      updateClassStatus: STATUS.NOT_STARTED,
      deleteClassStatus: STATUS.NOT_STARTED,
    });
  },

  resetStreamStatus: async () => {
    set({
      addStreamStatus: STATUS.NOT_STARTED,
      updateStreamStatus: STATUS.NOT_STARTED,
      deleteStreamStatus: STATUS.NOT_STARTED,
    });
  },

  resetSectionStatus: async () => {
    set({
      addSectionStatus: STATUS.NOT_STARTED,
      updateSectionStatus: STATUS.NOT_STARTED,
      deleteSectionStatus: STATUS.NOT_STARTED,
    });
  },

  resetSubjectStatus: async () => {
    set({
      addSubjectStatus: STATUS.NOT_STARTED,
      updateSubjectStatus: STATUS.NOT_STARTED,
      deleteSubjectStatus: STATUS.NOT_STARTED,
    });
  },

  resetClassSubjectStatus: async () => {
    set({
      addClassSubjectStatus: STATUS.NOT_STARTED,
      updateClassSubjectStatus: STATUS.NOT_STARTED,
      deleteClassSubjectStatus: STATUS.NOT_STARTED,
    });
  },

  reset: async () => {
    set({
      getClassStatus: STATUS.NOT_STARTED,
      getStreamStatus: STATUS.NOT_STARTED,
      getSectionStatus: STATUS.NOT_STARTED,
      getSubjectStatus: STATUS.NOT_STARTED,
    });
  },

  getClassDetailAction: async (payload) => {
    set({ getClassDetailStatus: STATUS.FETCHING });
    const { data } = await apis.getClassDetailApi(payload);
    if (data?.action === true) {
      set({
        allClassDetails: data.data,
        getClassDetailStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassDetailStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getClassAction: async (payload) => {
    set({ getClassStatus: STATUS.FETCHING });
    const { data } = await apis.getClassApi(payload);
    if (data?.action === true) {
      set({
        allClasses: data.data,
        getClassStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getMonthlyAttendaceAction: async (payload) => {
    set({ monthlyAttendaceStatus: STATUS.FETCHING });
    const { data } = await apis.getMonthlyAttendaceApi(payload);
    if (data?.action === true) {
      set({
        monthlyAttendace: data.data,
        monthlyAttendaceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ monthlyAttendaceStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addClassAction: async (payload) => {
    set({ addClassStatus: STATUS.FETCHING });
    const { data } = await apis.addClassApi(payload);
    if (data?.action === true) {
      const prev = get().allClasses;
      set({
        allClasses: concat(prev, data.data),
        addClassStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addClassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateClassAction: async (payload) => {
    set({ updateClassStatus: STATUS.FETCHING });
    const { data } = await apis.putClassApi(payload);
    if (data?.action === true) {
      const prev = get().allClasses;
      set({
        allClasses: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateClassStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateClassStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  deleteClassAction: async (payload) => {
    set({ deleteClassStatus: STATUS.FETCHING });
    const { data } = await apis.deleteClassApi(payload);
    if (data?.action === true) {
      const prev = get().allClasses;
      set({
        allClasses: filter(prev, (d) => d.id !== payload),
        deleteClassStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteClassStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  getStreamAction: async (payload) => {
    set({ getStreamStatus: STATUS.FETCHING });
    const { data } = await apis.getStreamApi(payload);
    if (data?.action === true) {
      set({
        allStreams: data.data,
        getStreamStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStreamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getStreamOnlineAction: async (payload) => {
    set({ getStreamOnlineStatus: STATUS.FETCHING });
    const { data } = await apis.getStreamOnlineApi(payload);
    if (data?.action === true) {
      set({
        allStreamsOnline: data.data,
        getStreamOnlineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStreamOnlineStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  addStreamAction: async (payload) => {
    set({ addStreamStatus: STATUS.FETCHING });
    const { data } = await apis.addStreamApi(payload);
    if (data?.action === true) {
      const prev = get().allStreams;
      set({
        allStreams: concat(prev, data.data),
        addStreamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addStreamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateStreamAction: async (payload) => {
    set({ updateStreamStatus: STATUS.FETCHING });
    const { data } = await apis.putStreamApi(payload);
    if (data?.action === true) {
      const prev = get().allStreams;
      set({
        allStreams: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateStreamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateStreamStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  deleteStreamAction: async (payload) => {
    set({ deleteStreamStatus: STATUS.FETCHING });
    const { data } = await apis.deleteStreamApi(payload);
    if (data?.action === true) {
      const prev = get().allStreams;
      set({
        allStreams: filter(prev, (d) => d.id !== payload),
        deleteStreamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteStreamStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  getSectionAction: async (payload) => {
    set({ getSectionStatus: STATUS.FETCHING });
    const { data } = await apis.getSectionApi(payload);
    if (data?.action === true) {
      set({
        allSections: data.data,
        getSectionStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSectionStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getSectionOnlineAction: async (payload) => {
    set({ getSectionOnlineStatus: STATUS.FETCHING });
    const { data } = await apis.getSectionOnlineApi(payload);
    if (data?.action === true) {
      set({
        allSectionsOnline: data.data,
        getSectionOnlineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSectionOnlineStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addSectionAction: async (payload) => {
    set({ addSectionStatus: STATUS.FETCHING });
    const { data } = await apis.addSectionApi(payload);
    if (data?.action === true) {
      const prev = get().allSections;
      set({
        allSections: concat(prev, data.data),
        addSectionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addSectionStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateSectionAction: async (payload) => {
    set({ updateSectionStatus: STATUS.FETCHING });
    const { data } = await apis.putSectionApi(payload);
    if (data?.action === true) {
      const prev = get().allSections;
      set({
        allSections: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateSectionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSectionStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  deleteSectionAction: async (payload) => {
    set({ deleteSectionStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSectionApi(payload);
    if (data?.action === true) {
      const prev = get().allSections;
      set({
        allSections: filter(prev, (d) => d.id !== payload),
        deleteSectionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSectionStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  getSubjectAction: async (payload) => {
    set({ getSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.getSubjectApi(payload);
    if (data?.action === true) {
      set({
        allSubjects: data.data,
        getSubjectStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSubjectStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addSubjectAction: async (payload) => {
    set({ addSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.addSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allSubjects;
      set({
        allSubjects: concat(prev, data.data),
        addSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addSubjectStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateSubjectAction: async (payload) => {
    set({ updateSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.putSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allSubjects;
      set({
        allSubjects: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSubjectStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  deleteSubjectAction: async (payload) => {
    set({ deleteSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allSubjects;
      set({
        allSubjects: filter(prev, (d) => d.id !== payload),
        deleteSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSubjectStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  getClassSubjectAction: async (payload) => {
    set({ getClassSubjectStatus: STATUS.FETCHING });
    const sessionMasterId =   getLocalStorageItem("sessionMasterId")
   
    const payloadData = {
      sessionMasterId
    }
    const { data } = await apis.getClassSubjectApi(payloadData);
    if (data?.action === true) {
      set({
        allClassSubjects: data.data,
        getClassSubjectStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassSubjectStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getClassSubjecOnlinetAction: async (payload) => {
    set({ getClassSubjectOnlineStatus: STATUS.FETCHING });
    const { data } = await apis.getClassSubjectOnlineApi(payload);
    if (data?.action === true) {
      set({
        allClassSubjectsOnline: data.data,
        getClassSubjectOnlineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassSubjectOnlineStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getClassSubjectCustomAction: async (payload) => {
    set({ getClassSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.getClassSubjectApi(payload);
    if (data?.action === true) {
      set({
        allClassSubjects: data.data,
        getClassSubjectStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassSubjectStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addClassSubjectAction: async (payload) => {
    set({ addClassSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.addClassSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allClassSubjects;
      set({
        // allClassSubjects: concat(prev, data.data),
        addClassSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addClassSubjectStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateClassSubjectAction: async (payload) => {
    set({ updateClassSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.putClassSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allClassSubjects;
      set({
        // allClassSubjects: map(prev, c => c.id === data.data.id ? data.data : c),
        updateClassSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateClassSubjectStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  deleteClassSubjectAction: async (payload) => {
    set({ deleteClassSubjectStatus: STATUS.FETCHING });
    const { data } = await apis.deleteClassSubjectApi(payload);
    if (data?.action === true) {
      const prev = get().allClassSubjects;
      set({
        allClassSubjects: filter(prev, (d) => d.id !== payload),
        deleteClassSubjectStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteClassSubjectStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  // Marque and POPUP Image

  deletehighlightAction: async (payload) => {
    set({ deleteHighlightStatus: STATUS.FETCHING });
    const { data } = await apis.deleteBannerApi(payload);
    if (data?.action === true) {
      set({
        allHighlight: [],
        deleteHighlightStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteHighlightStatus: STATUS.FAILED });
      ErrorAlert(data.message);
    }
  },

  getHighlightAction: async (payload) => {
    set({ getHighlightStatus: STATUS.FETCHING });
    const { data } = await apis.getBannerApi(payload);
    if (data?.action === true) {
      set({
        allHighlight: data.data,
        getHighlightStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getHighlightStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addHighlightAction: async (payload) => {
    set({ addHighlightStatus: STATUS.FETCHING });
    const { data } = await apis.addHighlightApi(payload);
    if (data?.action === true) {
      set({
        allHighlight: data.data,
        addHighlightStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addHighlightStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
}));
