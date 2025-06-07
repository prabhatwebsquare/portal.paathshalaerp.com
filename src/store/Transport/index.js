import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useTransportStore = create((set, get) => ({
  resetStatus: async () => {
    set({
      addStationStatus: STATUS.NOT_STARTED,
      updateStationStatus: STATUS.NOT_STARTED,
      deleteStationStatus: STATUS.NOT_STARTED,
    });
  },
  resetTransporterStatus: async () => {
    set({
      addTransporterStatus: STATUS.NOT_STARTED,
      updateTransporterStatus: STATUS.NOT_STARTED,
      deleteRouteStatus: STATUS.NOT_STARTED,
    });
  },
  resetTransportData: async () => {
    set({
      getStationStatus: STATUS.NOT_STARTED,
      allStations: [],
      getDriverStatus: STATUS.NOT_STARTED,
      allDrivers: [],
    });
  },
  resetFuelIssueStatus : async () => {
    set({
      addFuelIsshuStatus: STATUS.NOT_STARTED,
      updateFuelIssueStatus: STATUS.NOT_STARTED,
      getFuelIsshuStatus: STATUS.NOT_STARTED,
      deletefuelStatus: STATUS.NOT_STARTED,
    });
  },

  resetDriverStatus: async () => {
    set({
      addDriverStatus: STATUS.NOT_STARTED,
      updateDriverStatus: STATUS.NOT_STARTED,
      deleteDriverStatus: STATUS.NOT_STARTED,
    });
  },

  resetVehicleStatus: async () => {
    set({
      addVehicleStatus: STATUS.NOT_STARTED,
      updateVehicleStatus: STATUS.NOT_STARTED,
      deleteVehicleStatus: STATUS.NOT_STARTED,
    });
  },

  resetRouteStatus: async () => {
    set({
      addRouteStatus: STATUS.NOT_STARTED,
      updateRouteStatus: STATUS.NOT_STARTED,
      deleteRouteStatus: STATUS.NOT_STARTED,
    });
  },

  resetFeesHeadStatus: async () => {
    set({
      addFeesHeadStatus: STATUS.NOT_STARTED,
      updateFeesHeadStatus: STATUS.NOT_STARTED,
      deleteFeesHeadStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetFeesDefine: async () => {
    set({
      getFeesDefineStatus: STATUS.NOT_STARTED,
      allFeesDefines: [],
    });
  },

  resetFeesDefineStatus: async () => {
    set({
      addFeesDefineStatus: STATUS.NOT_STARTED,
      updateFeesDefineStatus: STATUS.NOT_STARTED,
      deleteFeesDefineStatus: STATUS.NOT_STARTED,
    });
  },

  resetCheckFees: async () => {
    set({
      allCheckFees: {},
      getCheckFeesStatus: STATUS.NOT_STARTED,
    });
  },

  getStationAction: async (payload) => {
    set({ getStationStatus: STATUS.FETCHING });
    const { data } = await apis.getStationApi(payload);
    if (data?.action === true) {
      set({
        allStations: data.data,
        getStationStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getStationByShiftAction: async (payload) => {
    set({ getStationByShiftStatus: STATUS.FETCHING });
    const { data } = await apis.getStationByShiftApi(payload);
    if (data?.action === true) {
      set({
        allStationsByShift: data.data,
        getStationByShiftStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStationByShiftStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addStationAction: async (payload) => {
    set({ addStationStatus: STATUS.FETCHING });
    const { data } = await apis.addStationApi(payload);
    if (data?.action === true) {
      const prev = get().allStations;
      set({
        allStations: concat(prev, data.data),
        addStationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addStationStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  addFuelIssueAction: async (payload) => {
    set({ addFuelIsshuStatus: STATUS.FETCHING });
    const { data } = await apis.addFuelIsshuApi(payload);
    if (data?.action === true) {
      const prev = get().addFuelIsshu;
      set({
        addFuelIsshu: [],
        addFuelIsshuStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addFuelIsshuStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateFuelIssueAction: async (payload) => {
    set({ updateFuelIssueStatus: STATUS.FETCHING });
    const { data } = await apis.updateFuelIsshueApi(payload);
    if (data?.action === true) {
      const prev = get().addFuelIsshu;
      set({
        addFuelIsshu: [],
        updateFuelIssueStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateFuelIssueStatus: STATUS.FAILED });
    }
  },
  getFuelIssueAction: async (payload) => {
    set({ getFuelIsshuStatus: STATUS.FETCHING });
    const { data } = await apis.getFuelIsshueApi(payload);
    if (data?.action === true) {
      set({
        addFuelIsshu: data.data,
        getFuelIsshuStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFuelIsshuStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deleteisshuedFuelAction: async (payload) => {
    set({ deletefuelStatus: STATUS.FETCHING });
    const { data } = await apis.deleteFuelApi(payload);
    if (data?.action === true) {
      set({
        addFuelIsshu: [],
        deletefuelStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deletefuelStatus: STATUS.FAILED });
    }
  },
  updateStationAction: async (payload) => {
    set({ updateStationStatus: STATUS.FETCHING });
    const { data } = await apis.updateStationApi(payload);
    if (data?.action === true) {
      const prev = get().allStations;
      set({
        allStations: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateStationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateStationStatus: STATUS.FAILED });
    }
  },

  deleteStationAction: async (payload) => {
    set({ deleteStationStatus: STATUS.FETCHING });
    const { data } = await apis.deleteStationApi(payload);
    if (data?.action === true) {
      const prev = get().allStations;
      set({
        allStations: filter(prev, (d) => d.id !== payload),
        deleteStationStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteStationStatus: STATUS.FAILED });
    }
  },

  getDriverAction: async (payload) => {
    set({ getDriverStatus: STATUS.FETCHING });
    const { data } = await apis.getDriverApi(payload);
    if (data?.action === true) {
      set({
        allDrivers: data.data,
        getDriverStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDriverStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  addDriverAction: async (payload) => {
    set({ addDriverStatus: STATUS.FETCHING });
    const { data } = await apis.addDriverApi(payload);
    if (data?.action === true) {
      const prev = get().allDrivers;
      set({
        allDrivers: concat(prev, data.data),
        addDriverStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addDriverStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateDriverAction: async (payload) => {
    set({ updateDriverStatus: STATUS.FETCHING });
    const { data } = await apis.updateDriverApi(payload);
    if (data?.action === true) {
      const prev = get().allDrivers;
      set({
        allDrivers: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateDriverStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateDriverStatus: STATUS.FAILED });
    }
  },

  deleteDriverAction: async (payload) => {
    set({ deleteDriverStatus: STATUS.FETCHING });
    const { data } = await apis.deleteDriverApi(payload);
    if (data?.action === true) {
      const prev = get().allDrivers;
      set({
        allDrivers: filter(prev, (d) => d.id !== payload),
        deleteDriverStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteDriverStatus: STATUS.FAILED });
    }
  },

  getTransporterAction: async (payload) => {
    set({ getTransporterStatus: STATUS.FETCHING });
    const { data } = await apis.getTransporterApi(payload);
    if (data?.action === true) {
      set({
        allTransporters: data.data,
        getTransporterStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getTransporterStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addTransporterAction: async (payload) => {
    set({ addTransporterStatus: STATUS.FETCHING });
    const { data } = await apis.addTransporterApi(payload);
    if (data?.action === true) {
      const prev = get().allTransporters;
      set({
        allTransporters: payload.id
          ? map(prev, (c) => (c.id === data.data.id ? data.data : c))
          : concat(prev, data.data),
        addTransporterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addTransporterStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateTransporterAction: async (payload) => {
    set({ updateTransporterStatus: STATUS.FETCHING });
    const { data } = await apis.updateTransporterApi(payload);
    if (data?.action === true) {
      const prev = get().allTransporters;
      set({
        allTransporters: [],
        updateTransporterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateTransporterStatus: STATUS.FAILED });
    }
  },

  deleteTransporterAction: async (payload) => {
    set({ deleteTransporterStatus: STATUS.FETCHING });
    const { data } = await apis.deleteTransporterApi(payload);
    if (data?.action === true) {
      const prev = get().allTransporters;
      set({
        allTransporters: filter(prev, (d) => d.id !== payload),
        deleteTransporterStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteTransporterStatus: STATUS.FAILED });
    }
  },

  getVehicleAction: async (payload) => {
    set({ getVehicleStatus: STATUS.FETCHING });
    const data = await apis.getVehicleApi(payload);
    if (data?.data?.action === true) {
      set({
        allVehicles: data.data.data,
        getVehicleStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getVehicleStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addVehicleAction: async (payload) => {
    set({ addVehicleStatus: STATUS.FETCHING });
    const data = await apis.addVehicleApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allVehicles;
      set({
        allVehicles: concat(prev, data.data.data),
        addVehicleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addVehicleStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateVehicleAction: async (payload) => {
    set({ updateVehicleStatus: STATUS.FETCHING });
    const data = await apis.updateVehicleApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allVehicles;
      set({
        allVehicles: [],
        updateVehicleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ updateVehicleStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  deleteVehicleAction: async (payload) => {
    set({ deleteVehicleStatus: STATUS.FETCHING });
    const data = await apis.deleteVehicleApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allVehicles;
      set({
        allVehicles: filter(prev, (d) => d.id !== payload),
        deleteVehicleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ deleteVehicleStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getRouteAction: async (payload) => {
    set({ getRouteStatus: STATUS.FETCHING });
    const data = await apis.getRouteApi(payload);
    if (data?.data?.action === true) {
      set({
        allRoutes: data.data.data,
        getRouteStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getRouteStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addRouteAction: async (payload) => {
    set({ addRouteStatus: STATUS.FETCHING });
    const data = await apis.addRouteApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allRoutes;
      set({
        allRoutes: concat(prev, data.data.data),
        addRouteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addRouteStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateRouteAction: async (payload) => {
    set({ updateRouteStatus: STATUS.FETCHING });
    const data = await apis.updateRouteApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allRoutes;
      set({
        allRoutes: map(prev, (c) =>
          c.id === data.data.data.id ? data.data.data : c
        ),
        updateRouteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ updateRouteStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  deleteRouteAction: async (payload) => {
    set({ deleteRouteStatus: STATUS.FETCHING });
    const data = await apis.deleteRouteApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allRoutes;

      set({
        allRoutes: filter(prev, (d) => d.id !== payload),
        deleteRouteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ deleteRouteStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFeesHeadAction: async (payload) => {
    set({ getFeesHeadStatus: STATUS.FETCHING });
    const { data } = await apis.getFeesHeadApi(payload);
    if (data?.action === true) {
      set({
        allFeesHeads: data.data,
        getFeesHeadStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesHeadStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addFeesHeadAction: async (payload) => {
    set({ addFeesHeadStatus: STATUS.FETCHING });
    const { data } = await apis.addFeesHeadApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesHeads;
      set({
        allFeesHeads: concat(prev, data.data),
        addFeesHeadStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addFeesHeadStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateFeesHeadAction: async (payload) => {
    set({ updateFeesHeadStatus: STATUS.FETCHING });
    const { data } = await apis.updateFeesHeadApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesHeads;
      set({
        allFeesHeads: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateFeesHeadStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateFeesHeadStatus: STATUS.FAILED });
    }
  },

  deleteFeesHeadAction: async (payload) => {
    set({ deleteFeesHeadStatus: STATUS.FETCHING });
    const { data } = await apis.deleteFeesHeadApi(payload);
    if (data?.action === true) {
      const prev = get().allFeesHeads;
      set({
        allFeesHeads: filter(prev, (d) => d.id !== payload),
        deleteFeesHeadStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteFeesHeadStatus: STATUS.FAILED });
    }
  },

  getFeesDefineAction: async (payload) => {
    set({ getFeesDefineStatus: STATUS.FETCHING });
    const data = await apis.getFeesDefineApi(payload);
    if (data?.data?.action === true) {
      set({
        allFeesDefines: data.data.data,
        paginationData: data.data.pagination,
        getFeesDefineStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesDefineStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addFeesDefineAction: async (payload) => {
    set({ addFeesDefineStatus: STATUS.FETCHING });
    const data = await apis.addFeesDefineApi(payload);
    if (data?.data?.action === true) {
      set({
        allFeesDefines: data.data.data,
        addFeesDefineStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addFeesDefineStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateFeesDefineAction: async (payload) => {
    set({ updateFeesDefineStatus: STATUS.FETCHING });
    const data = await apis.updateFeesDefineApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allFeesDefines;
      set({
        allFeesDefines: map(prev, (c) =>
          c.id === data.data.data.id ? data.data.data : c
        ),
        updateFeesDefineStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ updateFeesDefineStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  deleteFeesDefineAction: async (payload) => {
    set({ deleteFeesDefineStatus: STATUS.FETCHING });
    const data = await apis.deleteFeesDefineApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allFeesDefines;
      set({
        allFeesDefines: filter(prev, (d) => d.id !== payload),
        deleteFeesDefineStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ deleteFeesDefineStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getCheckFeesAction: async (payload) => {
    set({ getCheckFeesStatus: STATUS.FETCHING });
    const data = await apis.getCheckFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        allCheckFees: data.data,
        getCheckFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getCheckFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getStationFeesAction: async (payload) => {
    set({ getStationFeesStatus: STATUS.FETCHING });
    const data = await apis.getStationFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        allStationFees: data.data.data,
        getStationFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStationFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },


  getRouteWiseReportAction: async (payload) => {
    set({ getRouteWiseReportStatus: STATUS.FETCHING });
    const data = await apis.getRouteWiseReportApi(payload);
    if (data?.data?.action === true) {
      set({
        allRouteWiseReport: data.data.data,
        getRouteWiseReportStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getRouteWiseReportStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getDashboardAction: async (payload) => {
    set({ getDashboardStatus: STATUS.FETCHING });
    const data = await apis.getDashboardApi(payload);
    if (data?.data?.action === true) {
      set({
        dashboardData: data.data.data,
        getDashboardStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDashboardStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  trsaportStopAction: async (payload) => {
    set({ trsaportStopStatus: STATUS.FETCHING });
    const data = await apis.transportStopApi(payload);
    if (data?.data?.action === true) {
      set({
        trsaportStopStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ trsaportStopStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
}));
