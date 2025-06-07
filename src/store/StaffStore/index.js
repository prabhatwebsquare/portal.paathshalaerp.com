import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useStaffStore = create((set, get) => ({
  resetStaffStatus: async () => {
    set({
      addStaffStatus: STATUS.NOT_STARTED,
      updateStaffStatus: STATUS.NOT_STARTED,
      deleteStaffStatus: STATUS.NOT_STARTED,
      empRegistrationStatus : STATUS.NOT_STARTED,
    });
  },

  resetClassTeachStatus: async () => {
    set({
      addClassTeachStatus: STATUS.NOT_STARTED,
      updateClassTeachStatus: STATUS.NOT_STARTED,
      deleteClassTeachStatus: STATUS.NOT_STARTED,
    });
  },

  resetSubTeachStatus: async () => {
    set({
      addSubTeachStatus: STATUS.NOT_STARTED,
      updateSubTeachStatus: STATUS.NOT_STARTED,
      deleteSubTeachStatus: STATUS.NOT_STARTED,
    });
  },

  resetDayAttendStatus: async () => {
    set({
      addDayAttendStatus: STATUS.NOT_STARTED,
      addMonthlyAttendanceStatus: STATUS.NOT_STARTED,
    });
  },

  resetBioAttendanceStatus: async () => {
    set({
      getBioAttendanceStatus: STATUS.NOT_STARTED,
      bioAttendance: null,
    });
  },

  getStaffAction: async (payload) => {
    set({ getStaffStatus: STATUS.FETCHING });
    const { data } = await apis.getStaffApi(payload);
    if (data?.action === true) {
      set({
        allStaffs: data.data,
        getStaffStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStaffStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  empRegistrationAction: async (payload) => {
    set({ empRegistrationStatus: STATUS.FETCHING });
    const { data } = await apis.empRegistrationApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        allStaffs: concat(prev, data.data),
        empRegistrationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ empRegistrationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },


  promoteStaffAction: async (payload) => {
    set({ promoteStaffStatus: STATUS.FETCHING });
    const { data } = await apis.promoteStaffApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        promoteStaffStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ promoteStaffStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },


  addStaffAction: async (payload) => {
    set({ addStaffStatus: STATUS.FETCHING });
    const { data } = await apis.addStaffApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        allStaffs: concat(prev, data.data),
        addStaffStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addStaffStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateStaffAction: async (payload) => {
    set({ updateStaffStatus: STATUS.FETCHING });
    const { data } = await apis.updateStaffApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        allStaffs: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateStaffStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateStaffStatus: STATUS.FAILED });
    }
  },

  deleteStaffAction: async (payload) => {
    set({ deleteStaffStatus: STATUS.FETCHING });
    const { data } = await apis.deleteStaffApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        allStaffs: filter(prev, (d) => d.id !== payload),
        deleteStaffStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteStaffStatus: STATUS.FAILED });
    }
  },


  getClassTeachAction: async (payload) => {
    set({ getClassTeachStatus: STATUS.FETCHING });
    const { data } = await apis.getClassTeachApi(payload);
    if (data?.action === true) {
      set({
        allClassTeachs: data.data,
        getClassTeachStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addClassTeachAction: async (payload) => {
    set({ addClassTeachStatus: STATUS.FETCHING });
    const { data } = await apis.addClassTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allClassTeachs;
      set({
        allClassTeachs: concat(prev, data.data),
        addClassTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addClassTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateClassTeachAction: async (payload) => {
    set({ updateClassTeachStatus: STATUS.FETCHING });
    const { data } = await apis.updateClassTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allClassTeachs;
      set({
        allClassTeachs: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateClassTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateClassTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteClassTeachAction: async (payload) => {
    set({ deleteClassTeachStatus: STATUS.FETCHING });
    const { data } = await apis.deleteClassTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allClassTeachs;
      set({
        allClassTeachs: filter(prev, (d) => d.id !== payload),
        deleteClassTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteClassTeachStatus: STATUS.FAILED });
    }
  },

  getSubTeachAction: async (payload) => {
    set({ getSubTeachStatus: STATUS.FETCHING });
    const { data } = await apis.getSubTeachApi(payload);
    if (data?.action === true) {
      set({
        allSubTeachs: data.data,
        getSubTeachStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSubTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getSingleSubTeachAction: async (payload) => {
    set({ getSingleSubTeachStatus: STATUS.FETCHING });
    const { data } = await apis.getSingleSubTeachApi(payload);
    if (data?.action === true) {
      set({
        allSingleSubTeachs: data.data,
        getSingleSubTeachStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSingleSubTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addSubTeachAction: async (payload) => {
    set({ addSubTeachStatus: STATUS.FETCHING });
    const { data } = await apis.addSubTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allSubTeachs;
      set({
        allSubTeachs: [
          ...filter(prev, (p) => p.staffId !== data?.data?.[0]?.staffId),
          ...data?.data,
        ],
        addSubTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addSubTeachStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateSubTeachAction: async (payload) => {
    set({ updateSubTeachStatus: STATUS.FETCHING });
    const { data } = await apis.updateSubTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allSubTeachs;
      set({
        allSubTeachs: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateSubTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSubTeachStatus: STATUS.FAILED });
    }
  },

  deleteSubTeachAction: async (payload) => {
    set({ deleteSubTeachStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSubTeachApi(payload);
    if (data?.action === true) {
      const prev = get().allSubTeachs;
      set({
        allSubTeachs: filter(prev, (d) => d.staffId !== payload),
        deleteSubTeachStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSubTeachStatus: STATUS.FAILED });
    }
  },

  getDailyAttendanceAction: async (payload) => {
    set({ getDailyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getStaffDailyAttendanceApi(payload);
    if (data?.data?.action === true) {
      const prev = get().dailyAttendance;
      set({
        dailyAttendance: data?.data?.data,
        getDailyAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDailyAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getDayAttendAction: async (payload) => {
    set({ getDayAttendStatus: STATUS.FETCHING });
    const data = await apis.getStaffDayAttendApi(payload);
    if (data?.data?.action === true) {
      set({
        dayAttendance: data?.data?.data,
        getDayAttendStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDayAttendStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addDayAttendAction: async (payload) => {
    set({ addDayAttendStatus: STATUS.FETCHING });
    const data = await apis.addStaffDayAttendApi(payload);
    if (data?.data?.action === true) {
      const prev = get().dayAttendance;
      set({
        dayAttendance: data?.data?.data,
        addDayAttendStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addDayAttendStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getMonthlyAttendanceAction: async (payload) => {
    set({ getMonthlyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getStaffMonthlyAttendanceApi(payload);
    if (data?.data?.action === true) {
      const prev = get().monthlyAttendance;
      set({
        monthlyAttendance: data?.data?.data,
        getMonthlyAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMonthlyAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addMonthlyAttendanceAction: async (payload) => {
    set({ addMonthlyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.addStaffMonthlyAttendanceApi(payload);
    if (data?.data?.action === true) {
      const prev = get().monthlyAttendance;
      set({
        monthlyAttendance: data?.data?.data,
        addMonthlyAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ addMonthlyAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getYearlyAttendanceAction: async (payload) => {
    set({ getYearlyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getStaffYearlyAttendanceApi(payload);
    if (data?.data?.action === true) {
      const prev = get().yearlyAttendance;
      set({
        yearlyAttendance: data?.data?.data,
        getYearlyAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getYearlyAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getBioAttendanceAction: async (payload) => {
    set({ getBioAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getStaffBioAttendanceApi(payload);
    if (data?.data?.action === true) {
      set({
        bioAttendance: data?.data?.data,
        getBioAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBioAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  // employee registration Super Admin
  empRegistrationSuperAdminAction: async (payload) => {
    set({ empRegistrationSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.empRegistrationSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffs;
      set({
        allStaffsSuperAdmin: null,
        empRegistrationSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ empRegistrationSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateStaffSuperAdminAction: async (payload) => {
    set({ updateStaffSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.updateSuperAdminStaffApi(payload);
    if (data?.action === true) {
      const prev = get().allStaffsSuperAdmin;
      set({
        allStaffsSuperAdmin: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateStaffSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateStaffSuperAdminStatus: STATUS.FAILED });
    }
  },
  deleteSuperAdminStaffAction: async (payload) => {
    set({ deleteSuperAdminStaffStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSuperAdminStaffApi(payload);
    if (data?.action === true) {
      set({
        allStaffsSuperAdmin: null,
        deleteSuperAdminStaffStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSuperAdminStaffStatus: STATUS.FAILED });
    }
  },
  getStaffSuperAdminAction: async (payload) => {
    set({ getStaffSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.getStaffSuperAdminApi(payload);
    if (data?.action === true) {
      set({
        allStaffsSuperAdmin: data.data,
        getStaffSuperAdminStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStaffSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  resetStaffSuperAdminStatus: async () => {
    set({
      empRegistrationSuperAdminStatus: STATUS.NOT_STARTED,
      updateStaffSuperAdminStatus: STATUS.NOT_STARTED,
    });
  },
  resetAttendanceReport: async () => {
    set({
      getDayAttendStatus: STATUS.NOT_STARTED,
      getMonthlyAttendanceStatus: STATUS.NOT_STARTED,
      getYearlyAttendanceStatus: STATUS.NOT_STARTED,
      dayAttendance: [],
      monthlyAttendance: [],
      yearlyAttendance: [],
    });
  },
}));
