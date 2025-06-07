import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useSysAdminStore = create((set, get) => ({
    resetSchoolPermissionStatus: async () => {
        set({
            addSchoolPermissionStatus: STATUS.NOT_STARTED,
            updateSchoolPermissionStatus: STATUS.NOT_STARTED,
            deleteSchoolPermissionStatus: STATUS.NOT_STARTED
        })
    },
    
    getSchoolPermissionAction: async (payload) => {
        set({ getSchoolPermissionStatus: STATUS.FETCHING });
        const { data } = await apis.getSchoolPermissionApi(payload);
        if (data?.action === true) {
            set({
                allSchoolPermissions: data.data,
                getSchoolPermissionStatus: STATUS.SUCCESS
            })
        } else {
            set({ getSchoolPermissionStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addSchoolPermissionAction: async (payload) => {
        set({ addSchoolPermissionStatus: STATUS.FETCHING });
        const { data } = await apis.addSchoolPermissionApi(payload);
        if (data?.action === true) {
            const prev = get().allSchoolPermissions
            set({
                allSchoolPermissions: concat(prev, data.data),
                addSchoolPermissionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addSchoolPermissionStatus: STATUS.FAILED })
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