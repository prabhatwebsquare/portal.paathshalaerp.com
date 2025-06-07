import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useTimetableStore = create((set, get) => ({
  getTimetableMasterAction: async (payload) => {
    set({ getTimetableMasterStatus: STATUS.FETCHING });

    try {
      // Call the API
      const data = await apis.getTimeTableMasterpi(payload);

      if (!data || !data?.data) {
        set({ getTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert("Failed to fetch timetable data, please try again.");
        return; // Stop further execution
      }

      if (data?.data?.action === true) {
        set({
          TimetableMaster: data?.data?.data,
          getTimetableMasterStatus: STATUS.SUCCESS,
        });
      } else {
        set({ getTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert(
          data?.data?.message ||
            "An error occurred while fetching the timetable."
        );
      }
    } catch (error) {
      set({ getTimetableMasterStatus: STATUS.FAILED });
      ErrorAlert("An error occurred while processing the request.");
    }
  },

  addTimetableMasterAction: async (payload) => {
    set({ addTimetableMasterStatus: STATUS.FETCHING });

    try {
      const data = await apis.addTimeTableMastereApi(payload);
      if (!data || !data?.data) {
        set({ addTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert("Failed to fetch data, please try again.");
        return;
      }
      if (data?.data?.action === true) {
        set({
          addTimetableMasterStatus: STATUS.SUCCESS,
        });
      } else {
        set({ addTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert(
          data?.data?.message || "An error occurred while adding the timetable."
        );
      }
    } catch (error) {
      set({ addTimetableMasterStatus: STATUS.FAILED });
      ErrorAlert("An error occurred while processing the request.");
    }
  },
  updateTimetableMasterAction: async (payload) => {
    set({ addTimetableMasterStatus: STATUS.FETCHING });

    try {
      const data = await apis.updateimeTableMastereApi(payload);
      if (!data || !data?.data) {
        set({ addTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert("Failed to fetch data, please try again.");
        return;
      }
      if (data?.data?.action === true) {
        set({
          addTimetableMasterStatus: STATUS.SUCCESS,
        });
      } else {
        set({ addTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert(
          data?.data?.message || "An error occurred while adding the timetable."
        );
      }
    } catch (error) {
      set({ addTimetableMasterStatus: STATUS.FAILED });
      ErrorAlert("An error occurred while processing the request.");
    }
  },

  deleteTimetableMasterAction: async (payload) => {
    set({ TimetableMasterDeleteStatus: STATUS.FETCHING });
    const data = await apis.DeleteTimeTableMasterApi(payload);
    if (data?.data.action === true) {
      const prev = get().TimetableMaster;
      set({
        TimetableMaster: filter(prev, (d) => d.id !== payload),
        TimetableMasterDeleteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data.message);
    } else {
      set({ TimetableMasterDeleteStatus: STATUS.FAILED });
      ErrorAlert(data?.data.message);
    }
  },
  resetgetTimetableMasterStatus: async () => {
    set({
      getTimetableMasterStatus: STATUS.NOT_STARTED,
    });
  },
  resetaddTimetableMasterStatus: async () => {
    set({
      addTimetableMasterStatus: STATUS.NOT_STARTED,
    });
  },

  addTeacherRegistrionAction: async (payload) => {
    set({ teacherRegisterStatus: STATUS.FETCHING });
    const { data } = await apis.teacherRegistrationApi(payload);
    if (data?.action === true) {
      set({
        teacherRegisterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ teacherRegisterStatus: STATUS.FAILED });
    }
  },
  updateTeacherRegistrionAction: async (payload) => {
    set({ teacherRegisterStatus: STATUS.FETCHING });
    try {
      const data = await apis.updateTeacherRegistrationApi(payload);
      if (!data || !data?.data) {
        set({ teacherRegisterStatus: STATUS.FAILED });
        ErrorAlert("Failed to fetch data, please try again.");
        return;
      }
      if (data?.data?.action === true) {
        set({
          teacherRegisterStatus: STATUS.SUCCESS,
        });
      } else {
        set({ teacherRegisterStatus: STATUS.FAILED });
        ErrorAlert(
          data?.data?.message || "An error occurred while adding the timetable."
        );
      }
    } catch (error) {
      set({ teacherRegisterStatus: STATUS.FAILED });
      ErrorAlert("An error occurred while processing the request.");
    }
  },

  getTeacherRegistrionAction: async (payload) => {
    set({ getTimetableMasterStatus: STATUS.FETCHING });
    try {
      const data = await apis.getTeacherRegistrationrpi(payload);
      if (!data || !data?.data) {
        set({ getTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert("Failed to fetch timetable data, please try again.");
        return;
      }
      if (data?.data?.action === true) {
        set({
          RegisteredTeacher: data?.data?.data,
          getTimetableMasterStatus: STATUS.SUCCESS,
        });
      } else {
        set({ getTimetableMasterStatus: STATUS.FAILED });
        ErrorAlert(
          data?.data?.message ||
            "An error occurred while fetching the timetable."
        );
      }
    } catch (error) {
      set({ getTimetableMasterStatus: STATUS.FAILED });
      ErrorAlert("An error occurred while processing the request.");
    }
  },
  //  Assign TimeTable

  getDetailAssignTimeTableAction: async (payload) => {
    set({ detailAssignTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.DetailAssignTimeTableAApi(payload);
    if (data?.action === true) {
      set({
        wholeDetailTimeTable: data.data,
        detailAssignTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ detailAssignTimeTableStatus: STATUS.FAILED });
    }
  },

  AddDetailAssignTimeTableAction: async (payload) => {
    set({ adddetailAssignTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.DetailAssignTimeTableAApi(payload);
    if (data?.action === true) {
      set({
        adddetailAssignTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ adddetailAssignTimeTableStatus: STATUS.FAILED });
    }
  },
  assignTimeTableByDayWise: async (payload) => {
    set({ assignTimeTableByDayWiseStatus: STATUS.FETCHING });
    const { data } = await apis.AddDetailAssignTimeTableAApi(payload);
    if (data?.action === true) {
      set({
        assignTimeTableByDayWiseStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ assignTimeTableByDayWiseStatus: STATUS.FAILED });
    }
  },

  getStudentTimeTableAction: async (payload) => {
    set({ getStudentTimeTableStatus: STATUS.FETCHING });
    const { data } = await apis.GetStudentTimeTableApi(payload);
    if (data?.action === true) {
      set({
        getStudentTimeTable: data.data,
        getStudentTimeTableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ getStudentTimeTableStatus: STATUS.FAILED });
    }
  },

  getTeacherTimeTableAction: async (payload) => {
    set({ getTeacherTimetableStatus: STATUS.FETCHING });
    const { data } = await apis.GetTeacherTimeTableApi(payload);
    if (data?.action === true) {
      set({
        TeacherTimeTable: data.data,
        getTeacherTimetableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ getTeacherTimetableStatus: STATUS.FAILED });
    }
  },
  addAdjustmentTimetableAction: async (payload) => {
    set({ addAdjustmentTimetableStatus: STATUS.FETCHING });
    const { data } = await apis.addAdjustmentTimetableApi(payload);
    if (data?.action === true) {
      set({
        adjustmentTimeTableData: data.data,
        addAdjustmentTimetableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAdjustmentTimetableStatus: STATUS.FAILED });
    }
  },
  saveAdjustDataAction: async (payload) => {
    set({ saveAdjustDataStatus: STATUS.FETCHING });
    const { data } = await apis.saveAdjustmentTimetableApi(payload);
    if (data?.action === true) {
      set({
        adjustmentTimeTableData: [],
        saveAdjustDataStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ saveAdjustDataStatus: STATUS.FAILED });
    }
  },
  getAdjustTimeTableListAction: async (payload) => {
    set({ adjustTimeTableListStatus: STATUS.FETCHING });
    const { data } = await apis.getTimeTableAdjustmentListApi(payload);
    if (data?.action === true) {
      set({
        adjustTimeTableList: data.data,
        adjustTimeTableListStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ adjustTimeTableListStatus: STATUS.FAILED });
    }
  },
}));
