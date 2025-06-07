import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useSmsStore = create((set, get) => ({
    resetSmsSettingStatus: async () => {
        set({
            addSmsSettingStatus: STATUS.NOT_STARTED,
        })
    },
    
    resetSmsSettingData: async () => {
        set({
            getSmsSettingStatus: STATUS.NOT_STARTED,
            allSmsSettings: null
        })
    },

    getSmsSettingAction: async (payload) => {
        set({ getSmsSettingStatus: STATUS.FETCHING });
        const { data } = await apis.getSmsSettingApi(payload);
        if (data?.action === true) {
            set({
                allSmsSettings: data.data,
                getSmsSettingStatus: STATUS.SUCCESS
            })
        } else {
            set({ getSmsSettingStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addSmsSettingAction: async (payload) => {
        set({ addSmsSettingStatus: STATUS.FETCHING });
        const { data } = await apis.addSmsSettingApi(payload);
        if (data?.action === true) {
            set({
                allSmsSettings: data.data,
                addSmsSettingStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addSmsSettingStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateSchoolPermissionAction: async (payload) => {
        set({ updateSchoolPermissionStatus: STATUS.FETCHING });
        const { data } = await apis.updateSchoolPermissionApi(payload);
        if (data?.action === true) {
            const prev = get().allSchoolPermissions
            set({
                allSchoolPermissions: map(prev, c => c.id === data.data.id ? data.data : c),
                updateSchoolPermissionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateSchoolPermissionStatus: STATUS.FAILED })
        }
    },

    deleteSchoolPermissionAction: async (payload) => {
        set({ deleteSchoolPermissionStatus: STATUS.FETCHING });
        const { data } = await apis.deleteSchoolPermissionApi(payload);
        if (data?.action === true) {
            const prev = get().allSchoolPermissions
            set({
                allSchoolPermissions: filter(prev, d => d.id !== payload),
                deleteSchoolPermissionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteSchoolPermissionStatus: STATUS.FAILED })
        }
    },
}))