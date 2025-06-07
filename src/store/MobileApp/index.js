import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useMobileAppStore = create((set, get) => ({
  resetStatus: async () => {
    set({
      addAlbumStatus: STATUS.NOT_STARTED,
      updateAlbumStatus: STATUS.NOT_STARTED,
      deleteAlbumStatus: STATUS.NOT_STARTED,
    });
  },

  resetHolidayStatus: async () => {
    set({
      addHolidayStatus: STATUS.NOT_STARTED,
      updateHolidayStatus: STATUS.NOT_STARTED,
      deleteHolidayStatus: STATUS.NOT_STARTED,
    });
  },

  resetChapterStatus: async () => {
    set({
      addChapterStatus: STATUS.NOT_STARTED,
      updateChapterStatus: STATUS.NOT_STARTED,
      deleteChapterStatus: STATUS.NOT_STARTED,
    });
  },

  resetAppActivationStatus: async () => {
    set({
      addAppActivationStatus: STATUS.NOT_STARTED,
      updateAppActivationStatus: STATUS.NOT_STARTED,
      deleteAppActivationStatus: STATUS.NOT_STARTED,
    });
  },

  resetActivateStdStatus: async () => {
    set({
      addActivateStdStatus: STATUS.NOT_STARTED,
      updateActivateStdStatus: STATUS.NOT_STARTED,
      deleteActivateStdStatus: STATUS.NOT_STARTED,
    });
  },
  resetTimetableStatus: async () => {
    set({
      addTimetableStatus: STATUS.NOT_STARTED,
      updateTimetabletatus: STATUS.NOT_STARTED,
      deleteTimetableStatus: STATUS.NOT_STARTED,
    });
  },
  getAlbumAction: async (payload) => {
    set({ getAlbumStatus: STATUS.FETCHING });
    const { data } = await apis.getAlbumApi(payload);
    if (data?.action === true) {
      set({
        allAlbums: data.data,
        getAlbumStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAlbumStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getByIdAlbumAction: async (payload) => {
    set({ getByIdAlbumStatus: STATUS.FETCHING });
    const { data } = await apis.getByIdAlbumApi(payload);
    if (data?.action === true) {
      set({
        albumsData: data.data,
        getByIdAlbumStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getByIdAlbumStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addAlbumAction: async (payload) => {
    set({ addAlbumStatus: STATUS.FETCHING });
    const { data } = await apis.addAlbumApi(payload);
    if (data?.action === true) {
      const prev = get().allAlbums;
      set({
        allAlbums: concat(prev, data.data),
        addAlbumStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAlbumStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateAlbumAction: async (payload) => {
    set({ updateAlbumStatus: STATUS.FETCHING });
    const { data } = await apis.updateAlbumApi(payload);
    if (data?.action === true) {
      const prev = get().allAlbums;
      set({
        allAlbums: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateAlbumStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateAlbumStatus: STATUS.FAILED });
    }
  },

  deleteAlbumAction: async (payload) => {
    set({ deleteAlbumStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAlbumApi(payload);
    if (data?.action === true) {
      const prev = get().allAlbums;
      set({
        allAlbums: filter(prev, (d) => d.id !== payload),
        deleteAlbumStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteAlbumStatus: STATUS.FAILED });
    }
  },

  getHolidayAction: async (payload) => {
    set({ getHolidayStatus: STATUS.FETCHING });
    const { data } = await apis.getHolidayApi(payload);
    if (data?.action === true) {
      set({
        allHolidays: data.data,
        getHolidayStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getHolidayStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addHolidayAction: async (payload) => {
    set({ addHolidayStatus: STATUS.FETCHING });
    const { data } = await apis.addHolidayApi(payload);
    if (data?.action === true) {
      const prev = get().allHolidays;
      set({
        allHolidays: concat(prev, data.data),
        addHolidayStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addHolidayStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateHolidayAction: async (payload) => {
    set({ updateHolidayStatus: STATUS.FETCHING });
    const { data } = await apis.updateHolidayApi(payload);
    if (data?.action === true) {
      const prev = get().allHolidays;
      set({
        allHolidays: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateHolidayStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateHolidayStatus: STATUS.FAILED });
    }
  },

  deleteHolidayAction: async (payload) => {
    set({ deleteHolidayStatus: STATUS.FETCHING });
    const { data } = await apis.deleteHolidayApi(payload);
    if (data?.action === true) {
      const prev = get().allHolidays;
      set({
        allHolidays: filter(prev, (d) => d.id !== payload),
        deleteHolidayStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteHolidayStatus: STATUS.FAILED });
    }
  },

  getChapterAction: async (payload) => {
    set({ getChapterStatus: STATUS.FETCHING });
    const { data } = await apis.getChapterApi(payload);
    if (data?.action === true) {
      set({
        allChapters: data.data,
        getChapterStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getChapterStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  resetChapterStatus: async () => {
    set({
      addChapterStatus: STATUS.NOT_STARTED,
      updateChapterStatus: STATUS.NOT_STARTED,
      deleteChapterStatus: STATUS.NOT_STARTED,
    });
  },
  addChapterAction: async (payload) => {
    set({ addChapterStatus: STATUS.FETCHING });
    const { data } = await apis.addChapterApi(payload);
    if (data?.action === true) {
      const prev = get().allChapters;
      set({
        allChapters: [],
        addChapterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addChapterStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addHomeWorkAction: async (payload) => {
    set({ addHomeWorkStatus: STATUS.FETCHING });
    const { data } = await apis.addHomeWorkApi(payload);
    if (data?.action === true) {
      const prev = get().allHomework;
      set({
        allHomework: [],
        addHomeWorkStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addHomeWorkStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateHomeWorkAction: async (payload) => {
    set({ updateHomeWorktatus: STATUS.FETCHING });
    const { data } = await apis.updateHomeWorkApi(payload);
    if (data?.action === true) {
      set({
        allHomework: [],
        updateHomeWorktatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateHomeWorktatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteHomeWorkAction: async (payload) => {
    set({ deleteHomeWorkStatus: STATUS.FETCHING });
    const { data } = await apis.deleteHomeWorkApi(payload);
    if (data?.action === true) {
      const prev = get().allHomework;
      set({
        allHomework: filter(prev, (d) => d.id !== payload),
        deleteHomeWorkStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteHomeWorkStatus: STATUS.FAILED });
    }
  },
  addSyllabusAction: async (payload) => {
    set({ addSyllabusStatus: STATUS.FETCHING });
    const { data } = await apis.addSyllabusApi(payload);
    if (data?.action === true) {
      const prev = get().allHomework;
      set({
        allHomework: concat(prev, data.data),
        addSyllabusStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addSyllabusStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateSyllabusAction: async (payload) => {
    set({ updateSyllabusStatus: STATUS.FETCHING });
    const { data } = await apis.updateSyllabusApi(payload);
    if (data?.action === true) {
      const prev = get().allHomework;
      set({
        allHomework: map(prev, (c) => (c.id === payload.id ? data.data[0] : c)),
        updateSyllabusStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSyllabusStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getHomeWorkAction: async (payload) => {
    set({ getHomeWorkStatus: STATUS.FETCHING });
    const { data } = await apis.getHomeWorkApi(payload);
    if (data?.action === true) {
      set({
        allHomework: data.data,
        getHomeWorkStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getHomeWorkStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getSyllabusAction: async (payload) => {
    set({ getSyllabusStatus: STATUS.FETCHING });
    const { data } = await apis.getSyllabusApi(payload);
    const prev = get().allSyllabus;
    if (data?.action === true) {
      set({
        allSyllabus: data.data,
        getSyllabusStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSyllabusStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteSyllabusAction: async (payload) => {
    set({ deleteSyllabusStatus: STATUS.FETCHING });
    const { data } = await apis.deleteSyllabusApi(payload);
    if (data?.action === true) {
      const prev = get().allSyllabus;
      set({
        allSyllabus: filter(prev, (d) => d.id !== payload),
        deleteSyllabusStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteSyllabusStatus: STATUS.FAILED });
    }
  },

  resetHomeWorkStatus: async () => {
    set({
      addHomeWorkStatus: STATUS.NOT_STARTED,
      updateHomeWorktatus: STATUS.NOT_STARTED,
      deleteHomeWorkStatus: STATUS.NOT_STARTED,
    });
  },
  updateChapterAction: async (payload) => {
    set({ updateChapterStatus: STATUS.FETCHING });
    const { data } = await apis.updateChapterApi(payload);
    if (data?.action === true) {
      const prev = get().allChapters;
      set({
        allChapters: map(prev, (c) => (c.id === payload.id ? data.data[0] : c)),
        updateChapterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateChapterStatus: STATUS.FAILED });
    }
  },

  deleteChapterAction: async (payload) => {
    set({ deleteChapterStatus: STATUS.FETCHING });
    const { data } = await apis.deleteChapterApi(payload);
    if (data?.action === true) {
      const prev = get().allChapters;
      set({
        allChapters: filter(prev, (d) => d.id !== payload),
        deleteChapterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteChapterStatus: STATUS.FAILED });
    }
  },

  getAppActivationAction: async (payload) => {
    set({ getAppActivationStatus: STATUS.FETCHING });
    const { data } = await apis.getAppActivationApi(payload);
    if (data?.action === true) {
      set({
        allAppActivations: data?.data,
        getAppActivationStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAppActivationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addAppActivationAction: async (payload) => {
    set({ addAppActivationStatus: STATUS.FETCHING });
    const { data } = await apis.addAppActivationApi(payload);
    if (data?.action === true) {
      const prev = get().allAppActivations;
      set({
        allAppActivations: concat(prev, data.data),
        addAppActivationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addAppActivationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateAppActivationAction: async (payload) => {
    set({ updateAppActivationStatus: STATUS.FETCHING });
    const { data } = await apis.updateAppActivationApi(payload);
    if (data?.action === true) {
      const prev = get().allAppActivations;
      set({
        allAppActivations: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateAppActivationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateAppActivationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteAppActivationAction: async (payload) => {
    set({ deleteAppActivationStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAppActivationApi(payload);
    if (data?.action === true) {
      const prev = get().allAppActivations;
      set({
        allAppActivations: {
          ...prev,
          data: filter(prev?.data, (d) => d.id !== payload),
        },
        deleteAppActivationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteAppActivationStatus: STATUS.FAILED });
    }
  },

  getClassActivateStdAction: async (payload) => {
    set({ getClassActivateStdStatus: STATUS.FETCHING });
    const { data } = await apis.getClassActivateStdApi(payload);
    if (data?.action === true) {
      set({
        allClassActivateStds: data.data,
        getClassActivateStdStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassActivateStdStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getActivateStdDashAction: async (payload) => {
    set({ getActivateStdDashStatus: STATUS.FETCHING });
    const { data } = await apis.getActivateStdDashApi(payload);
    if (data?.action === true) {
      set({
        allActivateStdDashs: data.dashboard,
        getActivateStdDashStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getActivateStdDashStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getActivateStdAction: async (payload) => {
    set({ getActivateStdStatus: STATUS.FETCHING });
    const { data } = await apis.getActivateStdApi(payload);
    if (data?.action === true) {
      set({
        allActivateStds: data,
        getActivateStdStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getActivateStdStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addActivateStdAction: async (payload) => {
    set({ addActivateStdStatus: STATUS.FETCHING });
    const { data } = await apis.addActivateStdApi(payload);
    if (data?.action === true) {
      const prev = get().allActivateStdDashs;
      set({
        allActivateStdDashs: {
          ...prev,
          student: prev.student + data.data?.length,
          unUsed: prev.unUsed - data.data.length,
        },
        addActivateStdStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addActivateStdStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateActivateStdAction: async (payload) => {
    set({ updateActivateStdStatus: STATUS.FETCHING });
    const { data } = await apis.updateActivateStdApi(payload);
    if (data?.action === true) {
      const prev = get().allActivateStds;
      set({
        allActivateStds: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateActivateStdStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateActivateStdStatus: STATUS.FAILED });
    }
  },

  deleteteacherActivationAction: async (payload) => {
    set({ deleteteacherActivationStatus: STATUS.FETCHING });
    const { data } = await apis.deleteAppActivationApi(payload);
    if (data?.action === true) {
      set({
        deleteteacherActivationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteteacherActivationStatus: STATUS.FAILED });
    }
  },
  ActivateTeacherAction: async (payload) => {
    set({ ActivateTeacherStatus: STATUS.FETCHING });
    const { data } = await apis.addActivateTecApi(payload);
    if (data?.action === true) {
      set({
        ActivateTeacherStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ ActivateTeacherStatus: STATUS.FAILED });
    }
  },
  DeactivateTeacherAction: async (payload) => {
    set({ DeactivateTeacherStatus: STATUS.FETCHING });
    const { data } = await apis.DeactivateTecApi(payload);
    if (data?.action === true) {
      set({
        DeactivateTeacherStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ DeactivateTeacherStatus: STATUS.FAILED });
    }
  },
  uploadImageArray: async (payload) => {
    set({ uploadImageArrayStatus: STATUS.FETCHING });
    const { data } = await apis.uploadImageApi(payload);
    if (data?.action === true) {
      set({
        uploadImageArrayStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ uploadImageArrayStatus: STATUS.FAILED });
    }
  },
  getActivateteacherAction: async (payload) => {
    set({ getActivateTeacherStatus: STATUS.FETCHING });
    const { data } = await apis.getActivateTecApi(payload);
    if (data?.action === true) {
      set({
        allActivateTeacher: data,
        getActivateTeacherStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getActivateTeacherStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  resetActivatetecherStatus: async () => {
    set({
      addActivateStdStatus: STATUS.NOT_STARTED,
      updateActivateStdStatus: STATUS.NOT_STARTED,
      deleteActivateStdStatus: STATUS.NOT_STARTED,
    });
  },

  //Mobile Time Table

  addTimetableAction: async (payload) => {
    set({ addTimetableStatus: STATUS.FETCHING });
    const { data } = await apis.addMobileTimetableApi(payload);
    if (data?.action === true) {
      const prev = get().allTimetable;
      set({
        allTimetable: concat(prev, data.data),
        addTimetableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addTimetableStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateTimetableAction: async (payload) => {
    set({ updateTimetabletatus: STATUS.FETCHING });
    const { data } = await apis.updateAlbumApi(payload);
    if (data?.action === true) {
      const prev = get().allTimetable;
      set({
        allTimetable: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateTimetabletatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateTimetabletatus: STATUS.FAILED });
    }
  },

  deleteTimetableAction: async (payload) => {
    set({ deleteTimetableStatus: STATUS.FETCHING });
    const { data } = await apis.deleteTimeTableApi(payload);
    if (data?.action === true) {
      const prev = get().allTimetable;
      set({
        allTimetable: filter(prev, (d) => d.id !== payload),
        deleteTimetableStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteTimetableStatus: STATUS.FAILED });
    }
  },

  getTimetableAction: async (payload) => {
    set({ addTimetableStatus: STATUS.FETCHING });
    const { data } = await apis.getTimetableApi(payload);
    if (data?.action === true) {
      set({
        allTimetable: data.data,
        addTimetableStatus: STATUS.SUCCESS,
      });
    } else {
      set({ addTimetableStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  //gravience

  getGrevienceAction: async (payload) => {
    set({ getgreviencetatus: STATUS.FETCHING });
    const { data } = await apis.getGrevienceApi(payload);
    if (data?.action === true) {
      set({
        allgrevience: data.data.data,
        getgreviencetatus: STATUS.SUCCESS,
      });
    } else {
      set({ getgreviencetatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateGrevienceAction: async (payload) => {
    set({ updategreviencetatus: STATUS.FETCHING });
    const { data } = await apis.updateGreviencApi(payload);
    if (data?.action === true) {
      const prev = get().allgrevience;
      set({
        allgrevience: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updategreviencetatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updategreviencetatus: STATUS.FAILED });
    }
  },
}));
