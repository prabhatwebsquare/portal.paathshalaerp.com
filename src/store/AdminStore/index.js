import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAdminStore = create((set, get) => ({
  resetUpdateSchool: async () => {
    set({
      updateSchoolStatus: STATUS.NOT_STARTED,
    });
  },

  resetUserStatus: async () => {
    set({
      addUserStatus: STATUS.NOT_STARTED,
      updateUserStatus: STATUS.NOT_STARTED,
      deleteUserStatus: STATUS.NOT_STARTED,
    });
  },

  resetUserData: async () => {
    set({
      getUserStatus: STATUS.NOT_STARTED,
      allUsers: [],
    });
  },

  resetRoleStatus: async () => {
    set({
      addRoleStatus: STATUS.NOT_STARTED,
      updateRoleStatus: STATUS.NOT_STARTED,
      deleteRoleStatus: STATUS.NOT_STARTED,
    });
  },


  resetBioDeviceStatus: async () => {
    set({
      addBioDeviceStatus: STATUS.NOT_STARTED,
      updateBioDeviceStatus: STATUS.NOT_STARTED,
      deleteBioDeviceStatus: STATUS.NOT_STARTED,
    });
  },

  updateSchoolAction: async (payload) => {
    set({ updateSchoolStatus: STATUS.FETCHING });
    const { data } = await apis.updateSchoolApi(payload);
    if (data?.action === true) {
      set({
        updateSchool: data.data,
        updateSchoolStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateSchoolStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getMessageTemplateAction: async () => {
    set({ getMessageTemplateStatus: STATUS.FETCHING });
    const { data } = await apis.getMessageTemplateApi();
    if (data?.action === true) {
      set({
        messageTemplate: data.data,
        getMessageTemplateStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getMessageTemplateStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getUserAction: async (payload) => {
    set({ getUserStatus: STATUS.FETCHING });
    const { data } = await apis.getUserApi(payload);
    if (data?.action === true) {
      set({
        allUsers: data.data,
        getUserStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getUserStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addUserAction: async (payload) => {
    set({ addUserStatus: STATUS.FETCHING });
    const { data } = await apis.addUserApi(payload);
    if (data?.action === true) {
      const prev = get().allUsers;
      set({
        allUsers: concat(prev, data.data),
        addUserStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addUserStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  resetMessageTemplateStatus: async () => {
    set({
      addMessageTemplateStatus: STATUS.NOT_STARTED,
      updateMessageTemplateStatus: STATUS.NOT_STARTED,
    });
  },
  addMessageTemplateAction: async (payload) => {
    set({ addMessageTemplateStatus: STATUS.FETCHING });
    const { data } = await apis.addMessageTemplateApi(payload);
    if (data?.action === true) {
      const prev = get().messageTemplate;
      set({
        messageTemplate: concat(prev, data.data),
        addMessageTemplateStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addMessageTemplateStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateMessageTemplateAction: async (payload) => {
    set({ updateMessageTemplateStatus: STATUS.FETCHING });
    const { data } = await apis.updateMessageTemplateApi(payload);
    if (data?.action === true) {
      const prev = get().messageTemplate;
      set({
        messageTemplate: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateMessageTemplateStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateMessageTemplateStatus: STATUS.FAILED });
    }
  },
  deleteMessageTemplateAction: async (payload) => {
    set({ deleteMessageTemplateStatus: STATUS.FETCHING });
    const { data } = await apis.deleteMessageTemplateAction(payload);
    if (data?.action === true) {
      const prev = get().messageTemplate;
      set({
        messageTemplate: filter(prev, (d) => d.id !== payload),
        deleteMessageTemplateStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteMessageTemplateStatus: STATUS.FAILED });
    }
  },
  updateUserAction: async (payload) => {
    set({ updateUserStatus: STATUS.FETCHING });
    const { data } = await apis.updateUserApi(payload);
    if (data?.action === true) {
      const prev = get().allUsers;
      set({
        allUsers: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateUserStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateUserStatus: STATUS.FAILED });
    }
  },

  deleteUserAction: async (payload) => {
    set({ deleteUserStatus: STATUS.FETCHING });
    const { data } = await apis.deleteUserApi(payload);
    if (data?.action === true) {
      const prev = get().allUsers;
      set({
        allUsers: filter(prev, (d) => d.id !== payload),
        deleteUserStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteUserStatus: STATUS.FAILED });
    }
  },

  getRoleAction: async (payload) => {
    set({ getRoleStatus: STATUS.FETCHING });
    const { data } = await apis.getRoleApi(payload);
    if (data?.action === true) {
      set({
        allRoles: data.data,
        getRoleStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getRoleStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addRoleAction: async (payload) => {
    set({ addRoleStatus: STATUS.FETCHING });
    const { data } = await apis.addRoleApi(payload);
    if (data?.action === true) {
      const prev = get().allRoles;
      set({
        allRoles: concat(prev, data.data),
        addRoleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addRoleStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateRoleAction: async (payload) => {
    set({ updateRoleStatus: STATUS.FETCHING });
    const { data } = await apis.updateRoleApi(payload);
    if (data?.action === true) {
      const prev = get().allRoles;
      set({
        allRoles: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateRoleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateRoleStatus: STATUS.FAILED });
    }
  },

  deleteRoleAction: async (payload) => {
    set({ deleteRoleStatus: STATUS.FETCHING });
    const { data } = await apis.deleteRoleApi(payload);
    if (data?.action === true) {
      const prev = get().allRoles;
      set({
        allRoles: filter(prev, (d) => d.id !== payload),
        deleteRoleStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteRoleStatus: STATUS.FAILED });
    }
  },

  getBioDeviceAction: async (payload) => {
    set({ getBioDeviceStatus: STATUS.FETCHING });
    const { data } = await apis.getBioDeviceApi(payload);
    if (data?.action === true) {
      set({
        allBioDevices: data.data,
        getBioDeviceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBioDeviceStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addBioDeviceAction: async (payload) => {
    set({ addBioDeviceStatus: STATUS.FETCHING });
    const { data } = await apis.addBioDeviceApi(payload);
    if (data?.action === true) {
      const prev = get().allBioDevices;
      set({
        allBioDevices: concat(prev, data.data),
        addBioDeviceStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addBioDeviceStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  updateBioDeviceAction: async (payload) => {
    set({ updateBioDeviceStatus: STATUS.FETCHING });
    const { data } = await apis.updateBioDeviceApi(payload);
    if (data?.action === true) {
      const prev = get().allBioDevices;
      set({
        allBioDevices: map(prev, (c) =>
          c.id === data.data.id ? data.data : c
        ),
        updateBioDeviceStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateBioDeviceStatus: STATUS.FAILED });
    }
  },

  deleteBioDeviceAction: async (payload) => {
    set({ deleteBioDeviceStatus: STATUS.FETCHING });
    const { data } = await apis.deleteBioDeviceApi(payload);
    if (data?.action === true) {
      const prev = get().allBioDevices;
      set({
        allBioDevices: filter(prev, (d) => d.id !== payload),
        deleteBioDeviceStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteBioDeviceStatus: STATUS.FAILED });
    }
  },
  gatTeacherLeaveAction: async (payload) => {
    set({ gatTeacherLeaveStatus: STATUS.FETCHING });
    const { data } = await apis.gatTeacherLeaveApi(payload);
    if (data?.action === true) {
      set({
        LeaveRequest: data.data,
        gatTeacherLeaveStatus: STATUS.SUCCESS,
      });
    } else {
      set({ gatTeacherLeaveStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateTeacherLeaveAction: async (payload) => {
    set({ updateTeacherLeaveStatus: STATUS.FETCHING });
    const { data } = await apis.updateTeacherLeaveRequest(payload);
    if (data?.action === true) {
      const prev = get().LeaveRequest;
      set({
        LeaveRequest: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateTeacherLeaveStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateTeacherLeaveStatus: STATUS.FAILED });
    }
  },  
  // Super Admin Role Functonality
  getRoleSuperAdminAction: async (payload) => {
    set({ getRoleSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.getRoleSuperAdminApi(payload);
    if (data?.action === true) {
      set({
        allRolesSuperAdmin: data.data,
        getRoleSuperAdminStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getRoleSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  deleteRoleSuperAdminAction: async (payload) => {
    set({ deleteRoleSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.deleteRoleSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().allRolesSuperAdmin;
      set({
        allRolesSuperAdmin: filter(prev, (d) => d.id !== payload),
        deleteRoleSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteRoleSuperAdminStatus: STATUS.FAILED });
    }
  },
  resetRoleSuperAdminStatus: async () => {
    set({
      addRoleSuperAdminStatus: STATUS.NOT_STARTED,
      updateRoleSuperAdminStatus: STATUS.NOT_STARTED,
      deleteRoleSuperAdminStatus: STATUS.NOT_STARTED,
    });
  },
  addRoleSuperAdminAction: async (payload) => {
    set({ addRoleSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.addRoleSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().allRolesSuperAdmin;
      set({
        allRolesSuperAdmin: concat(prev, data.data),
        addRoleSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addRoleSuperAdminStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  updateRoleSuperAdminAction: async (payload) => {
    set({ updateRoleSuperAdminStatus: STATUS.FETCHING });
    const { data } = await apis.updateRoleSuperAdminApi(payload);
    if (data?.action === true) {
      const prev = get().allRolesSuperAdmin;
      set({
        allRolesSuperAdmin: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        updateRoleSuperAdminStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ updateRoleSuperAdminStatus: STATUS.FAILED });
    }
  },  
}));
