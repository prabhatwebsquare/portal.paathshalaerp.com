import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useTransportFeesStore = create((set, get) => ({
    resetRegistrationStatus: async () => {
        set({
            addStdRegistrationStatus: STATUS.NOT_STARTED,
        })
    },
    resetMulRegistrationStatus: async () => {
        set({
            addStdMulRegistrationStatus: STATUS.NOT_STARTED,
        })
    },
    

    getStdRegistrationAction: async (payload) => {
        set({ getStdRegistrationStatus: STATUS.FETCHING });
        const { data } = await apis.getStdRegistrationApi(payload);
        if (data?.action === true) {
            set({
                allStdRegistrations: data.date,
                getStdRegistrationStatus: STATUS.SUCCESS
            })
        } else {
            set({ getStdRegistrationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
    getStdNonRegistrationAction: async (payload) => {
        set({ getStdNonRegistrationStatus: STATUS.FETCHING });
        const { data } = await apis.getStdNonRegistrationApi(payload);
        if (data?.action === true) {
            set({
                allStdNonRegistrations: data.data,
                getStdNonRegistrationStatus: STATUS.SUCCESS
            })
        } else {
            set({ getStdNonRegistrationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addStdRegistrationAction: async (payload) => {
        set({ addStdRegistrationStatus: STATUS.FETCHING });
        const { data } = await apis.addStdRegistrationApi(payload);
        if (data?.action === true) {
            const prev = get().allStdRegistrations
            set({
                allStdRegistrations: concat(prev, data.data),
                addStdRegistrationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addStdRegistrationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addStdMulRegistrationAction: async (payload) => {
        set({ addStdMulRegistrationStatus: STATUS.FETCHING });
        const { data } = await apis.addStdMulRegistrationApi(payload);
        if (data?.action === true) {
            set({
                addStdMulRegistrationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addStdMulRegistrationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateStationAction: async (payload) => {
        set({ updateStationStatus: STATUS.FETCHING });
        const { data } = await apis.updateStationApi(payload);
        if (data?.action === true) {
            const prev = get().allStations
            set({
                allStations: map(prev, c => c.id === data.data.id ? data.data : c),
                updateStationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateStationStatus: STATUS.FAILED })
        }
    },

    deleteStationAction: async (payload) => {
        set({ deleteStationStatus: STATUS.FETCHING });
        const { data } = await apis.deleteStationApi(payload);
        if (data?.action === true) {
            const prev = get().allStations
            set({
                allStations: filter(prev, d => d.id !== payload),
                deleteStationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteStationStatus: STATUS.FAILED })
        }
    },
}))