import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useStudentStore = create((set, get) => ({
  resetAddEnquiry: async () => {
    set({
      addEnquiryStatus: STATUS.NOT_STARTED,
      editEnquiryStatus: STATUS.NOT_STARTED,
      deleteEnquiryStatus: STATUS.NOT_STARTED,
    });
  },

  resetGetEnquiry: async () => {
    set({
      getEnquiryStatus: STATUS.NOT_STARTED,
      allEnquiry: [],
    });
  },

  resetFollowupStatus: async () => {
    set({
      addFollowUpStatus: STATUS.NOT_STARTED,
    });
  },

  resetFollowupList: async () => {
    set({
      getFollowUpStatus: STATUS.NOT_STARTED,
      followups: [],
    });
  },

  resetAdmissionStatus: async () => {
    set({
      addStudentStatus: STATUS.NOT_STARTED,
      editStudentStatus: STATUS.NOT_STARTED,
    });
  },

  resetStudent: async () => {
    set({
      getAllStudentStatus: STATUS.NOT_STARTED,
      getSRListStatus: STATUS.NOT_STARTED,
    });
  },

  resetDeleteStudent: async () => {
    set({
      deleteStudentStatus: STATUS.NOT_STARTED,
    });
  },

  resetUploadStatus: async () => {
    set({
      uploadStudentPicStatus: STATUS.NOT_STARTED,
    });
  },

  resetStdDetailsStatus: async () => {
    set({
      getStudentDetailsStatus: STATUS.NOT_STARTED,
      studentDetails: null,
      dashboardData: null,
    });
  },

  resetFilterStdStatus: async () => {
    set({
      getFilterStudentsStatus: STATUS.NOT_STARTED,
      filterStudents: [],
    });
  },

  resetbulkAdmissionStatus: async () => {
    set({
      bulkAdmissionStatus: STATUS.NOT_STARTED,
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
  resetBioStaffAttendanceStatus: async () => {
    set({
      getBioStaffAttendanceStatus: STATUS.NOT_STARTED,
      bioStaffAttendance: null,
    });
  },

  resetGetSRStatus: async () => {
    set({
      studentSR: null,
      getStudentSRStatus: STATUS.NOT_STARTED,
    });
  },

  resetSRStatus: async () => {
    set({
      studentSR: null,
      updateSrStatus: STATUS.NOT_STARTED,
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

  resetLibraryCardStatus: async () => {
    set({
      addLibraryCardStatus: STATUS.NOT_STARTED,
    });
  },

  resetPassStatus: async () => {
    set({
      addPassStatus: STATUS.NOT_STARTED,
      editPassStatus: STATUS.NOT_STARTED,
      deletePassStatus: STATUS.NOT_STARTED,
      getPassStatus: STATUS.NOT_STARTED,
      allPasses: [],
    });
  },
  addPassAction: async (payload) => {
    set({ addPassStatus: STATUS.FETCHING });
    const { data } = await apis.addPassApi(payload);
    if (data?.action === true) {
      const prev = get().allPasses;
      set({
        allPasses: concat(prev, data.data),
        addPassStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addPassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getPassAction: async (payload) => {
    set({ getPassStatus: STATUS.FETCHING });
    const { data } = await apis.getPassApi(payload);
    if (data?.action === true) {
      set({
        allPasses: data.data,
        getPassStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getPassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  editPassAction: async (payload) => {
    set({ editPassStatus: STATUS.FETCHING });

    const { data } = await apis.editPassApi(payload);

    if (data?.action === true) {
      const prev = get().allPasses;

      set({
        allPasses: prev.map((pass) =>
          pass.id === data.data.id ? data.data : pass
        ),
        editPassStatus: STATUS.SUCCESS,
      });

      SuccessAlert(data?.message);
    } else {
      set({ editPassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deletePassAction: async (payload) => {
    set({ deletePassStatus: STATUS.FETCHING });

    const { data } = await apis.deletePassApi(payload);

    if (data?.action === true) {
      const prev = get().allPasses;

      set({
        allPasses: [],
        deletePassStatus: STATUS.SUCCESS,
      });

      SuccessAlert(data?.message);
    } else {
      set({ deletePassStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  addEnquiryAction: async (payload) => {
    set({ addEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.addEnquiryApi(payload);
    if (data?.action === true) {
      const prev = get().allEnquiry;
      set({
        addEnquiry: concat(prev, data.data),
        addEnquiryStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getEnquiryAction: async (payload) => {
    set({ getEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.getEnquiryApi(payload);
    if (data?.action === true) {
      set({
        allEnquiry: data.data,
        getEnquiryStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  getOnlineAdmissionEnquiryAction: async (payload) => {
    set({ getOnlineAdmissionEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.getOnlineAdmissionEnquiryApi(payload);
    if (data?.action === true) {
      set({
        allOnlineAdmissionEnquiry: data.data.data,
        getOnlineAdmissionEnquiryStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getOnlineAdmissionEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  getSingleEnquiryAction: async (payload) => {
    set({ getSingleEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.getSingleEnquiryApi(payload);
    if (data?.action === true) {
      set({
        enquiryDetails: data.data,
        getSingleEnquiryStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSingleEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  editEnquiryAction: async (payload) => {
    set({ editEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.editEnquiryApi(payload);
    if (data?.action === true) {
      const prev = get().allEnquiry;
      set({
        allEnquiry: map(prev, (c) => (c.id === data.data.id ? data.data : c)),
        editEnquiryStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ editEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  deleteEnquiryAction: async (payload) => {
    set({ deleteEnquiryStatus: STATUS.FETCHING });
    const { data } = await apis.deleteEnquiryApi(payload);
    if (data?.action === true) {
      const prev = get().allEnquiry;
      set({
        allEnquiry: filter(prev, (d) => d.id !== payload),
        deleteEnquiryStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ deleteEnquiryStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },

  addStudentAction: async (payload) => {
    set({ addStudentStatus: STATUS.FETCHING });
    const data = await apis.addStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        addStudent: data?.data?.data,
        addStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  addStudentOnlineAction: async (payload) => {
    set({ addStudentStatus: STATUS.FETCHING });
    const data = await apis.addStudentOnlineApi(payload);
    if (data?.data?.action === true) {
      set({
        addStudent: data?.data?.data,
        addStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ addStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getSchoolInfoAction: async (payload) => {
    set({ SchoolInfoStatus: STATUS.FETCHING });
    const data = await apis.getSchoolInfoApi(payload);
    if (data?.data?.action === true) {
      set({
        SchoolInfo: data?.data,
        SchoolInfoStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ SchoolInfoStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  editStudentAction: async (payload) => {
    set({ editStudentStatus: STATUS.FETCHING });
    const data = await apis.editStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        editStudent: data?.data?.data,
        editStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ editStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getAllStudentAction: async (payload) => {
    set({ getAllStudentStatus: STATUS.FETCHING });
    const data = await apis.getAllStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        allStudents: data?.data,
        getAllStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAllStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  deleteStudentAction: async (payload) => {
    set({ deleteStudentStatus: STATUS.FETCHING });
    const data = await apis.deleteStudentApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allStudents;
      set({
        allStudents: {
          ...prev,
          data: filter(prev.data, (d) => d.id !== payload),
        },
        deleteStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ deleteStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  restrictStudentAction: async (payload) => {
    set({ restrictStudentStatus: STATUS.FETCHING });
    const data = await apis.restrictStudentApi(payload);
    if (data?.data?.action === true) {
      const prev = get().allStudents;
      set({
        allStudents: {
          ...prev,
          data: filter(prev.data, (d) => d.id !== payload?.promotionId),
        },
        restrictStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ restrictStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  uploadStudentPicAction: async (payload) => {
    set({ uploadStudentPicStatus: STATUS.FETCHING });
    const data = await apis.uploadStudentPicApi(payload);
    if (data?.data?.action === true) {
      set({
        uploadedPic: data?.data,
        uploadStudentPicStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ uploadStudentPicStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  checkExistAction: async (payload) => {
    set({ checkExistStatus: STATUS.FETCHING });
    const data = await apis.checkExistApi(payload);
    if (data?.data) {
      set({
        checkExist: data?.data,
        checkExistStatus: STATUS.SUCCESS,
      });
      if (data.data.action === false) {
        ErrorAlert(data?.data?.message);
      }
    }
  },

  bulkAdmissionAction: async (payload) => {
    set({ bulkAdmissionStatus: STATUS.FETCHING });
    const data = await apis.bulkAdmissionApi(payload);
    if (data?.data?.action === true) {
      set({
        bulkAdmission: data.data,
        bulkAdmissionStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.message);
    } else {
      set({ bulkAdmissionStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getCustomStudentAction: async (payload) => {
    set({ getCustomStudentStatus: STATUS.FETCHING });
    const data = await apis.getCustomStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        customStudents: data?.data?.data,
        getCustomStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getCustomStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getCategoryReportAction: async (payload) => {
    set({ getCategoryReportStatus: STATUS.FETCHING });
    const data = await apis.getCategoryReportApi(payload);
    if (data?.data?.action === true) {
      set({
        categoryReports: data?.data?.data,
        getCategoryReportStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getCategoryReportStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addFollowUpAction: async (payload) => {
    set({ addFollowUpStatus: STATUS.FETCHING });
    const data = await apis.addFollowUpApi(payload);
    if (data?.data?.action === true) {
      const prev = get().followups;
      set({
        followups: concat(prev, data?.data?.data),
        addFollowUpStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addFollowUpStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFollowUpAction: async (payload) => {
    set({ getFollowUpStatus: STATUS.FETCHING });
    const data = await apis.getFollowUpApi(payload);
    if (data?.data?.action === true) {
      set({
        followups: data?.data?.data,
        getFollowUpStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFollowUpStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  resetFeesFollowupList: async () => {
    set({
      addFeesFollowUpStatus: STATUS.NOT_STARTED,
      feesFollowups: [],
      getFeesFollowUpStatus: STATUS.NOT_STARTED,
    });
  },
  resetFeesFollowupAllList: async () => {
    set({
      getFeesFollowUpDateWiseStatus: STATUS.NOT_STARTED,
      feesFollowupsDateWise: [],
    });
  },
  getFeesFollowUpDateWiseAction: async (payload) => {
    set({ getFeesFollowUpDateWiseStatus: STATUS.FETCHING });
    const data = await apis.getFeesFollowUpDateWiseApi(payload);
    if (data?.data?.action === true) {
      set({
        feesFollowupsDateWise: data?.data,
        getFeesFollowUpDateWiseStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesFollowUpDateWiseStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  deleteStudentAction: async (payload) => {
    set({ deleteStudentStatus: STATUS.FETCHING });
    const data = await apis.deleteMultipleStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        deleteStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ deleteStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addFeesFollowUpAction: async (payload) => {
    set({ addFeesFollowUpStatus: STATUS.FETCHING });
    const data = await apis.addFeesFollowUpApi(payload);
    if (data?.data?.action === true) {
      const prev = get().feesFollowups || [];
      set({
        feesFollowups: concat(prev, data?.data?.data),
        addFeesFollowUpStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addFeesFollowUpStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFeesFollowUpAction: async (payload) => {
    set({ getFeesFollowUpStatus: STATUS.FETCHING });
    const data = await apis.getFeesFollowUpApi(payload);
    if (data?.data?.action === true) {
      set({
        feesFollowups: data?.data?.data,
        getFeesFollowUpStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesFollowUpStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getStudentDetailsAction: async (payload) => {
    set({ getStudentDetailsStatus: STATUS.FETCHING });
    const data = await apis.getStudentDetailsApi(payload);
    if (data?.data?.action === true) {
      set({
        studentDetails: data?.data?.data,
        dashboardData: data?.data,
        getStudentDetailsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStudentDetailsStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFilterStudentsAction: async (payload) => {
    set({ getFilterStudentsStatus: STATUS.FETCHING });
    const data = await apis.getFilterStudentsApi(payload);
    if (data?.data?.action === true) {
      set({
        filterStudents: data?.data?.data,
        getFilterStudentsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFilterStudentsStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  restoreStudentAction: async (payload) => {
    set({ restoreStudentStatus: STATUS.FETCHING });
    const data = await apis.restrictStudentApi(payload);
    if (data?.data?.action === true) {
      const prev = get().filterStudents;
      set({
        filterStudents: filter(prev, (d) => d.id !== payload.promotionId),
        restoreStudentStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ restoreStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  tcStudentAction: async (payload) => {
    set({ tcStudentStatus: STATUS.FETCHING });
    const { data } = await apis.getRteStudentpi(payload);
    if (data?.action === true) {
      set({
        filterStudents: data?.data,
        tcStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ tcStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  resetTcStudentStatus: async () => {
    set({
      tcStudentStatus: STATUS.NOT_STARTED,
    });
  },
  getsubjectWiseStudentAction: async (payload) => {
    set({ getSubjectWiseStatus: STATUS.FETCHING });
    const data = await apis.getSubjectWiseApi(payload);
    if (data?.data?.action === true) {
      set({
        SubjectWise: data?.data?.data,
        getSubjectWiseStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSubjectWiseStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  resetSubjectWiseStatus: async () => {
    set({
      getSubjectWiseStatus: STATUS.NOT_STARTED,
      SubjectWise: [],
    });
  },
  getDailyAttendanceAction: async (payload) => {
    set({ getDailyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getDailyAttendanceApi(payload);
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
    const data = await apis.getDayAttendApi(payload);
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
    const data = await apis.addDayAttendApi(payload);
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

  getStdMonthAttAction: async (payload) => {
    set({ getStdMonthAttStatus: STATUS.FETCHING });
    const data = await apis.getStdMonthAttApi(payload);
    if (data?.data?.action === true) {
      set({
        stdMonthAtt: data?.data?.data,
        getStdMonthAttStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStdMonthAttStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getStaffMonthAttAction: async (payload) => {
    set({ getStaffMonthAttStatus: STATUS.FETCHING });
    const data = await apis.getStaffMonthAttApi(payload);
    if (data?.data?.action === true) {
      set({
        staffMonthAtt: data?.data?.data,
        getStaffMonthAttStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStaffMonthAttStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  resetDayStaffAttendStatus: async () => {
    set({
      addMonthlyStaffAttendanceStatus: STATUS.NOT_STARTED,
    });
  },
  addMonthlyStaffAttendanceAction: async (payload) => {
    set({ addMonthlyStaffAttendanceStatus: STATUS.FETCHING });
    const data = await apis.addMonthlyStaffAttendanceApi(payload);
    if (data?.data?.action === true) {
      const prev = get().monthlyAttendance;
      set({
        monthlyStaffAttendance: data?.data?.data,
        addMonthlyStaffAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ addMonthlyStaffAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getMonthlyAttendanceAction: async (payload) => {
    set({ getMonthlyAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getMonthlyAttendanceApi(payload);
    if (data?.data?.action === true) {
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
    const data = await apis.addMonthlyAttendanceApi(payload);
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
    const data = await apis.getYearlyAttendanceApi(payload);
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
    const data = await apis.getBioAttendanceApi(payload);
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
  getBioStaffAttendanceAction: async (payload) => {
    set({ getBioStaffAttendanceStatus: STATUS.FETCHING });
    const data = await apis.getBioStaffAttendanceApi(payload);
    if (data?.data?.action === true) {
      set({
        bioStaffAttendance: data?.data?.data,
        getBioStaffAttendanceStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getBioStaffAttendanceStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getSRListAction: async (payload) => {
    set({ getSRListStatus: STATUS.FETCHING });
    const data = await apis.getSRListApi(payload);
    if (data?.data?.action === true) {
      set({
        srList: data?.data,
        getSRListStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSRListStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getStudentSRAction: async (payload) => {
    set({ getStudentSRStatus: STATUS.FETCHING });
    const data = await apis.getStudentSRApi(payload);
    if (data?.data?.action === true) {
      set({
        studentSR: data?.data,
        getStudentSRStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStudentSRStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateSrAction: async (payload) => {
    set({ updateSrStatus: STATUS.FETCHING });
    const data = await apis.updateSrApi(payload);
    if (data?.data?.action === true) {
      set({
        studentSR: data?.data?.data,
        updateSrStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ updateSrStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addLibraryCardAction: async (payload) => {
    set({ addLibraryCardStatus: STATUS.FETCHING });
    const { data } = await apis.addLibraryCardApi(payload);
    if (data?.action === true) {
      const prev = get().filterStudents;
      set({
        filterStudents: map(prev, (std) =>
          std.id === data.data.promotionId ? { ...std, ...data.data } : std
        ),
        addLibraryCardStatus: STATUS.SUCCESS,
      });
    } else {
      set({ addLibraryCardStatus: STATUS.FAILED });
      ErrorAlert(data?.message);
    }
  },
  hardDeleteStudentsAction: async (payload) => {
    set({ hardDeleteStatus: STATUS.FETCHING });
    const data = await apis.hardDeleteStudentApi(payload);
    if (data?.data.action === true) {
      const prev = get().filterStudents;
      set({
        filterStudents: filter(prev, (d) => d.id !== payload),
        hardDeleteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data.message);
    } else {
      set({ hardDeleteStatus: STATUS.FAILED });
      ErrorAlert(data?.data.message);
    }
  },

  getStudentBirthdayAction: async (payload) => {
    set({ getStudentBirthdayStatus: STATUS.FETCHING });
    const { data } = await apis.getStudentBirthdayApi(payload);
    if (data?.action === true) {
      set({
        studentBirthday: data?.data,
        getStudentBirthdayStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStudentBirthdayStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getAgeWiseAction: async (payload) => {
    set({ getAgeWiseStatus: STATUS.FETCHING });
    const { data } = await apis.getAgeWiseApi(payload);
    if (data?.action === true) {
      set({
        ageWise: data?.data,
        getAgeWiseStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAgeWiseStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getRTEStudentAction: async (payload) => {
    set({ getrteStudentStatus: STATUS.FETCHING });
    const { data } = await apis.getRteStudentpi(payload);
    if (data?.action === true) {
      set({
        rteStudent: data?.data,
        getrteStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getrteStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getClassWiseAgeAction: async (payload) => {
    set({ getClassWiseAgeStatus: STATUS.FETCHING });
    const { data } = await apis.getClassWiseAgeApi(payload);
    if (data?.action === true) {
      set({
        classWiseAge: data?.data,
        getClassWiseAgeStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassWiseAgeStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
}));
