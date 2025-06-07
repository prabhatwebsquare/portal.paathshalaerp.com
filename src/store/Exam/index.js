import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useExamStore = create((set, get) => ({
  resetStatus: async () => {
    set({
      addExamStatus: STATUS.NOT_STARTED,
      updateExamStatus: STATUS.NOT_STARTED,
      deleteExamStatus: STATUS.NOT_STARTED,
    });
  },

  resetGroupStatus: async () => {
    set({
      addExamGroupStatus: STATUS.NOT_STARTED,
      updateExamGroupStatus: STATUS.NOT_STARTED,
      deleteExamGroupStatus: STATUS.NOT_STARTED,
    });
  },

  resetAssignStatus: async () => {
    set({
      addAssignExamStatus: STATUS.NOT_STARTED,
      editAssignExamStatus: STATUS.NOT_STARTED,
      deleteAssignExamStatus: STATUS.NOT_STARTED,
    });
  },

  resetExamTimeTableStatus: async () => {
    set({
      addExamTimeTableStatus: STATUS.NOT_STARTED,
      editExamTimeTableStatus: STATUS.NOT_STARTED,
      deleteExamTimeTableStatus: STATUS.NOT_STARTED,
    });
  },

  resetRollNoStatus: async () => {
    set({
      assignRollNoStatus: STATUS.NOT_STARTED,
    });
  },

  resetExamMarks: async () => {
    set({
      addExamMarksStatus: STATUS.NOT_STARTED,
      getExamMarksStatus: STATUS.NOT_STARTED,
      examMarks: [],
    });
  },

  resetMarkSheet: async () => {
    set({
      getMarkSheetStatus: STATUS.NOT_STARTED,
      markSheet: null,
    });
  },

  getExamAction: async (payload) => {
    set({ getExamStatus: STATUS.FETCHING });
    const { data } = await apis.getExamApi(payload);
    if (data?.action === true) {
      set({
        allExams: data.data,
        getExamStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addExamAction: async (payload) => {
    set({ addExamStatus: STATUS.FETCHING });
    const { data } = await apis.addExamApi(payload);
    if (data?.action === true) {
      const prev = get().allExams;
      set({
        allExams: concat(prev, data.data),
        addExamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateExamAction: async (payload) => {
    set({ updateExamStatus: STATUS.FETCHING });
    const { data } = await apis.updateExamApi(payload);
    if (data?.action === true) {
      const prev = get().allExams;
      set({
        allExams: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateExamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateExamStatus: STATUS.FAILED });
    }
  },

  deleteExamAction: async (payload) => {
    set({ deleteExamStatus: STATUS.FETCHING });
    const { data } = await apis.deleteExamApi(payload);
    if (data?.action === true) {
      const prev = get().allExams;
      set({
        allExams: filter(prev, (d) => d.id !== payload),
        deleteExamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getExamGroupAction: async (payload) => {
    set({ getExamGroupStatus: STATUS.FETCHING });
    const { data } = await apis.getExamGroupApi(payload);
    if (data?.action === true) {
      set({
        allExamGroups: data.data,
        getExamGroupStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getExamGroupStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addExamGroupAction: async (payload) => {
    set({ addExamGroupStatus: STATUS.FETCHING });
    const { data } = await apis.addExamGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allExamGroups;
      set({
        allExamGroups: concat(prev, data.data),
        addExamGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addExamGroupStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateExamGroupAction: async (payload) => {
    set({ updateExamGroupStatus: STATUS.FETCHING });
    const { data } = await apis.updateExamGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allExamGroups;
      set({
        allExamGroups: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateExamGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateExamGroupStatus: STATUS.FAILED });
    }
  },

  deleteExamGroupAction: async (payload) => {
    set({ deleteExamGroupStatus: STATUS.FETCHING });
    const { data } = await apis.deleteExamGroupApi(payload);
    if (data?.action === true) {
      const prev = get().allExamGroups;
      set({
        allExamGroups: filter(prev, (d) => d.id !== payload),
        deleteExamGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteExamGroupStatus: STATUS.FAILED });
    }
  },

  addAssignExamAction: async (payload) => {
    set({ addAssignExamStatus: STATUS.FETCHING });
    const { data } = await apis.addAssignExamApi(payload);
    if (data?.action === true) {
      const prev = get().allAssignExams;
      set({
        allAssignExams: concat(prev, [data.data]),
        addAssignExamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAssignExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getAssignExamAction: async (payload) => {
    set({ getAssignExamStatus: STATUS.FETCHING });
    const { data } = await apis.getAssignExamApi(payload);
    if (data?.action === true) {
      set({
        allAssignExams: data.data,
        getAssignExamStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAssignExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  editAssignExamAction: async (payload) => {
    set({ editAssignExamStatus: STATUS.FETCHING });
    const { data } = await apis.editAssignExamApi(payload);
    if (data?.action === true) {
      const prev = get().allAssignExams;
      set({
        allAssignExams: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        editAssignExamStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ editAssignExamStatus: STATUS.FAILED });
    }
  },

  deleteAssignExamAction: async (payload) => {
    set({ deleteAssignExamStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAssignExamApi(payload);
    if (data?.action === true) {
      const prev = get().allAssignExams;
      set({
        allAssignExams: filter(prev, (d) => d.id !== payload),
        deleteAssignExamStatus: STATUS.SUCCESS,
      });
    } else {
      set({ deleteAssignExamStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getResultStrucAction: async (payload) => {
    set({ getResultStrucStatus: STATUS.FETCHING });
    const { data } = await apis.getResultStrucApi(payload);
    if (data?.action === true) {
      set({
        resultStruc: data.data,
        getResultStrucStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getResultStrucStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateResultStrucAction: async (payload) => {
    set({ updateResultStrucStatus: STATUS.FETCHING });
    const { data } = await apis.updateResultStrucApi(payload);
    if (data?.action === true) {
      const prev = get().resultStruc;
      const struc = data.data;
      set({
        resultStruc:
          struc.isDivision === "1"
            ? { ...prev, divisionData: struc.data }
            : { ...prev, gradeData: struc.data },
        updateResultStrucStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateResultStrucStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  assignRollNoAction: async (payload) => {
    set({ assignRollNoStatus: STATUS.FETCHING });
    const data = await apis.assignRollNoApi(payload);
    if (data?.data?.action === true) {
      set({
        assignedRollNo: data.data.data,
        assignRollNoStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ assignRollNoStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addExamTimeTableAction: async (payload) => {
    set({ addExamTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.addExamTimeTableApi(payload);
    if (data?.action === true) {
      const prev = get().examTimeTable;
      set({
        examTimeTable: data.data,
        addExamTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addExamTimeTableStatus: STATUS.FAILED });
    }
  },

  getExamTimeTableAction: async (payload) => {
    set({ getExamTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.getExamTimeTableApi(payload);
    if (data?.action === true) {
      set({
        examTimeTable: data.data,
        getExamTimeTableStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getExamTimeTableStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  editExamTimeTableAction: async (payload) => {
    set({ editExamTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.editExamTimeTableApi(payload);
    if (data?.action === true) {
      const prev = get().examTimeTable;
      set({
        examTimeTable: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        editExamTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ editExamTimeTableStatus: STATUS.FAILED });
    }
  },

  deleteExamTimeTableAction: async (payload) => {
    set({ deleteExamTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.deleteExamTimeTableApi(payload);
    if (data?.action === true) {
      const prev = get().examTimeTable;
      set({
        examTimeTable: filter(prev, (d) => d.id !== payload),
        deleteExamTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteExamTimeTableStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addExamMarksAction: async (payload) => {
    set({ addExamMarksStatus: STATUS.FETCHING });
    const { data } = await apis.addExamMarksApi(payload);
    if (data?.action === true) {
      const prev = get().examMarks;
      set({
        addExamMarksStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addExamMarksStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getExamMarksAction: async (payload) => {
    set({ getExamMarksStatus: STATUS.FETCHING });
    const { data } = await apis.getExamMarksApi(payload);
    if (data?.action === true) {
      const prev = get().examTimeTable;
      set({
        examMarks: data,
        getExamMarksStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getExamMarksStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getMarkSheetAction: async (payload) => {
    set({ getMarkSheetStatus: STATUS.FETCHING });
    const { data } = await apis.getMarkSheetApi(payload);
    if (data?.action === true) {
      set({
        markSheet: data.data,
        getMarkSheetStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMarkSheetStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addpublishMarksheetGroupAction: async (payload) => {
    set({ publishMarksheetGroupStatus: STATUS.FETCHING });
    const { data } = await apis.publishMarksheetGroupApi(payload);
    if (data?.action === true) {
      const prev = get().publishMarksheetGroup;
      set({
        publishMarksheetGroup: concat(prev, data?.data),
        publishMarksheetGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ publishMarksheetGroupStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getpublishMarksheetGroupAction: async (payload) => {
    set({ getpublishMarksheetGroupStatus: STATUS.FETCHING });
    const { data } = await apis.getpublishMarksheetGroupApi(payload);
    if (data?.action === true) {
      set({
        publishMarksheetGroup: data.data,
        getpublishMarksheetGroupStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getpublishMarksheetGroupStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deletepublishMarksheetGroupAction: async (payload) => {
    set({ deletepublishMarksheetGroupStatus: STATUS.FETCHING });
    const { data } = await apis.deletepublishMarksheetGroupApi(payload);
    if (data?.action === true) {
      const prev = get().publishMarksheetGroup;
      set({
        publishMarksheetGroup: filter(prev, (d) => d.id !== payload),
        deletepublishMarksheetGroupStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deletepublishMarksheetGroupStatus: STATUS.FAILED });
    }
  },
  resetPublishMarksheetStatus: async () => {
    set({
      publishMarksheetGroupStatus: STATUS.NOT_STARTED,
      getpublishMarksheetGroupStatus: STATUS.NOT_STARTED,
      deletepublishMarksheetGroupStatus: STATUS.NOT_STARTED,
    });
  },

  updatepublishMarksheetGroupAction: async (payload) => {
    set({ updatepublishMarksheetGroupStatus: STATUS.FETCHING });
    const { data } = await apis.updatepublishMarksheetGroupApi(payload);
    if (data?.action === true) {
      const prev = get().publishMarksheetGroup;
      set({
        updatepublishMarksheetGroupStatus: STATUS.SUCCESS,
        publishMarksheetGroup: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
      });
      SuccessAlert(data?.message);
    } else {
      set({ updatepublishMarksheetGroupStatus: STATUS.FAILED });
    }
  },
}));
