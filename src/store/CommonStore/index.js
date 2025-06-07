import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useCommonStore = create((set, get) => ({
    resetCommonStatus: async () => {
        set({
            getStateStatus: STATUS.NOT_STARTED,
            getDistrictStatus: STATUS.NOT_STARTED,
        })
    },

    getStateAction: async (payload) => {
        set({ getStateStatus: STATUS.FETCHING });
        const { data } = await apis.getStateApi(payload);
        if (data?.action === true) {
            set({
                allStates: data.list,
                getStateStatus: STATUS.SUCCESS
            })
        } else {
            set({ getStateStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getDistrictAction: async (payload) => {
        set({ getDistrictStatus: STATUS.FETCHING });
        const { data } = await apis.getDistrictApi(payload);
        if (data?.action === true) {
            set({
                allDistricts: data.list,
                getDistrictStatus: STATUS.SUCCESS
            })
        } else {
            set({ getDistrictStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
}))