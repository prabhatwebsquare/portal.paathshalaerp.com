import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useStdFeesStore = create((set, get) => ({
  resetSearch: async () => {
    set({
      searchStudentStatus: STATUS.NOT_STARTED,
      searchStd: [],
      searchLedStudentStatus: STATUS.NOT_STARTED,
      searchLedStd: [],
    });
  },
  resetStudentFee: async () => {
    set({
      getStudentFeesStatus: STATUS.NOT_STARTED,
      // studentFees: null,
    });
  },
  resetFeesLedger: async () => {
    set({
      getFeesLedgerStatus: STATUS.NOT_STARTED,
      feesLedger: null,
    });
  },
  resetStudentPromoteStatus: async () => {
    set({
      addStudentPromoteStatus: STATUS.NOT_STARTED,
      pendingFees: null,
    });
  },

  
  resetCollectFee: async () => {
    set({
      collectStdFeesStatus: STATUS.NOT_STARTED,
      updateCollectFeesStatus: STATUS.NOT_STARTED,
    });
  },
  resetCancelFee: async () => {
    set({
      cancelFeesStatus: STATUS.NOT_STARTED,
    });
  },
  resetFeesReceipt: async () => {
    set({
      getFeesReceiptStatus: STATUS.NOT_STARTED,
    });
  },
  resetFeeCollection: async () => {
    set({
      getCollectionsStatus: STATUS.NOT_STARTED,
      collectionsData: [],
    });
  },
  resetPendingFees: async () => {
    set({
      getPendingFeesStatus: STATUS.NOT_STARTED,
      pendingFees: null,
    });
  },

  resetChequeStatus: async () => {
    set({
      updateChequeStatusStatus: STATUS.NOT_STARTED,
    });
  },
  resetDiscount: async () => {
    set({
      applyDiscountStatus: STATUS.NOT_STARTED,
      updateAssignDiscountStatus: STATUS.NOT_STARTED,
    });
  },
  resetDiscountData: async () => {
    set({
      getAssignDiscountStatus: STATUS.NOT_STARTED,
      assignedDiscount: null,
      getDiscountStatus: STATUS.NOT_STARTED,
      allDiscounts: null,
    });
  },

  resetSiblingStatus: async () => {
    set({
      addSiblingStatus: STATUS.NOT_STARTED,
      getAllSiblingsStatus: STATUS.NOT_STARTED,
      getSiblingsStatus: STATUS.NOT_STARTED,
      allSiblings: null,
      siblings: null,
    });
  },

  resetOpeningStudStatus: async () => {
    set({
      getOpeningStudStatus: STATUS.NOT_STARTED,
      addOpeningStudStatus: STATUS.NOT_STARTED,
      openingStud: null,
    });
  },

  searchStudentAction: async (payload) => {
    set({ searchStudentStatus: STATUS.FETCHING });
    const data = await apis.searchStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        searchStd: data.data.data,
        searchStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ searchStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  searchLedStudentAction: async (payload) => {
    set({ searchLedStudentStatus: STATUS.FETCHING });
    const data = await apis.searchStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        searchLedStd: data.data.data,
        searchLedStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ searchLedStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFeesLedgerAction: async (payload) => {
    set({ getFeesLedgerStatus: STATUS.FETCHING });
    const data = await apis.getFeesLedgerApi(payload);
    if (data?.data?.action === true) {
      set({
        feesLedger: data.data.data,
        getFeesLedgerStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesLedgerStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getStudentFeesAction: async (payload) => {
    set({ getStudentFeesStatus: STATUS.FETCHING });
    const data = await apis.getStudentFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        studentFees: data.data.data,
        getStudentFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getStudentFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  collectStdFeesAction: async (payload) => {
    set({ collectStdFeesStatus: STATUS.FETCHING });
    const data = await apis.collectStdFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        collectStdFees: data.data.data,
        collectStdFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ collectStdFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  makeStudentFeesRTEAction: async (payload) => {
    set({ makeStudentFeesRTEStatus: STATUS.FETCHING });
    const data = await apis.makeStudentFeesRTEApi(payload);
    if (data?.data?.action === true) {
      SuccessAlert(data.data.message);
    } else {
      set({ makeStudentFeesRTEStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateCollectFees: async (payload) => {
    set({ updateCollectFeesStatus: STATUS.FETCHING });
    const data = await apis.updateCollectFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        collectStdFees: data.data?.data,
        updateCollectFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ updateCollectFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFeesReceiptAction: async (payload) => {
    set({ getFeesReceiptStatus: STATUS.FETCHING });
    const data = await apis.getFeesReceiptApi(payload);
    if (data?.data?.action === true) {
      set({
        feeReceiptData: data.data,
        getFeesReceiptStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesReceiptStatus: STATUS.FAILED });
      ErrorAlert(data.data.message);
    }
  },

  getOpenFeesReceiptAction: async (payload) => {
    set({ getOpenFeesReceiptStatus: STATUS.FETCHING });
    const data = await apis.getOpenFeesReceiptApi(payload);

    if (data?.data?.action === true) {
      set({
        openFeeReceiptData: data.data,
        getOpenFeesReceiptStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getOpenFeesReceiptStatus: STATUS.FAILED });
      ErrorAlert(data.data.message);
    }
  },

  getCollectionsAction: async (payload) => {
    set({ getCollectionsStatus: STATUS.FETCHING });
    const data = await apis.getCollectionsApi(payload);
    if (data?.data?.action === true) {
      set({
        collectionsData: data.data?.data,
        totalCount: data.data?.totalCount,
        getCollectionsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getCollectionsStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  addCollectFeesAction: async (payload) => {
    set({ addCollectFeesStatus: STATUS.FETCHING });
    const data = await apis.addCollectFeesApi(payload);
    if (data?.data?.action === true) {
      set({ addCollectFeesStatus: STATUS.SUCCESS });
    } else {
      set({ addCollectFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  cancelFeesAction: async (payload) => {
    set({ cancelFeesStatus: STATUS.FETCHING });
    const data = await apis.cancelFeesApi(payload);
    if (data?.data?.action === true) {
      const prev = get().collectionsData;
      set({
        collectionsData: map(prev, (d) =>
          d.id === data.data?.data.id ? { ...d, status: "Cancelled" } : d
        ),
        cancelFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ cancelFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getPendingFeesAction: async (payload) => {
    set({ getPendingFeesStatus: STATUS.FETCHING });
    const data = await apis.getPendingFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        pendingFees: data.data.data,
        getPendingFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getPendingFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getClassStudentAction: async (payload) => {
    set({ getClassStudentStatus: STATUS.FETCHING });
    const data = await apis.getClassWiseStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        ClassStudent: data.data.data,
        getClassStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getPermotedStudentAction: async (payload) => {
    set({ getPermotedStudentStatus: STATUS.FETCHING });
    const data = await apis.getPermotedStudentApi(payload);
    if (data?.data?.action === true) {
      set({
        PermotedStudent: data.data.data,
        getPermotedStudentStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getPermotedStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  resetPermotedStudent: async () => {
    set({
      getPermotedStudentStatus: STATUS.NOT_STARTED,
      PermotedStudent: null,
    });
  },

  addStudentPromoteAction: async (payload) => {
    set({ addStudentPromoteStatus: STATUS.FETCHING });
    const data = await apis.addStudentPromoteApi(payload);
    if (data?.data?.action === true) {
      set({
        addStudentPromoteStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data?.data?.message);
    } else {
      set({ addStudentPromoteStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getClassFeesAction: async (payload) => {
    set({ getClassFeesStatus: STATUS.FETCHING });
    const data = await apis.getPendingFeesApi(payload);
    if (data?.data?.action === true) {
      set({
        ClassFees: data.data.data,
        getClassFeesStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getFeesSummaryAction: async (payload) => {
    set({ getFeesSummaryStatus: STATUS.FETCHING });
    const data = await apis.getFeesSummaryApi(payload);
    if (data?.data?.action === true) {
      set({
        feesSummary: data.data.data,
        getFeesSummaryStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getFeesSummaryStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  resetClassSummary: async () => {
    set({
      getClassSummaryStatus: STATUS.NOT_STARTED,
      ClassSummary: null,
    });
  },
  getClassSummaryAction: async (payload) => {
    set({ getClassSummaryStatus: STATUS.FETCHING });
    const data = await apis.getClassSummaryApi(payload);
    if (data?.data?.action === true) {
      set({
        ClassSummary: data.data.data,
        getClassSummaryStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getClassSummaryStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getChequeListAction: async (payload) => {
    set({ getChequeListStatus: STATUS.FETCHING });
    const data = await apis.getChequeListApi(payload);
    if (data?.data?.action === true) {
      set({
        chequeDashboardData: data.data.dashboardData,
        chequeList: data.data.data,
        getChequeListStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getChequeListStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateChequeStatusAction: async (payload) => {
    set({ updateChequeStatusStatus: STATUS.FETCHING });
    const data = await apis.updateChequeStatusApi(payload);
    if (data?.data?.action === true) {
      const prev = get().chequeList;
      const curr = data.data.data;
      set({
        chequeUpdate: curr,
        chequeList: map(prev, (cheq) =>
          cheq.id === curr.feesReportId
            ? {
                ...cheq,
                chequeStatus: curr.chequeStatus,
                date: curr.date,
                remark: curr.remark,
                ledgerMasterId: curr.ledgerMasterId,
              }
            : cheq
        ),
        updateChequeStatusStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ updateChequeStatusStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getDiscountAction: async (payload) => {
    set({ getDiscountStatus: STATUS.FETCHING });
    const data = await apis.getDiscountApi(payload);
    if (data?.data?.action === true) {
      set({
        allDiscounts: data.data.data,
        getDiscountStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getDiscountStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  applyDiscountAction: async (payload) => {
    set({ applyDiscountStatus: STATUS.FETCHING });
    const data = await apis.applyDiscountApi(payload);
    if (data?.data?.action === true) {
      set({
        applyDiscount: data.data.data,
        applyDiscountStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ applyDiscountStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getAssignDiscountAction: async (payload) => {
    set({ getAssignDiscountStatus: STATUS.FETCHING });
    const data = await apis.getAssignDiscountApi(payload);
    if (data?.data?.action === true) {
      set({
        dashboardData: data.data.dashboardData,
        assignedDiscount: data.data.data,
        getAssignDiscountStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAssignDiscountStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  updateAssignDiscountAction: async (payload) => {
    set({ updateAssignDiscountStatus: STATUS.FETCHING });
    const data = await apis.updateAssignDiscountApi(payload);
    if (data?.data?.action === true) {
      const prev = get().assignedDiscount;
      const discount = data.data.data;
      set({
        assignedDiscount: map(prev, (d) =>
          d.id === discount.id ? { ...d, status: discount.status } : d
        ),
        updateAssignDiscountStatus: STATUS.SUCCESS,
      });
    } else {
      set({ updateAssignDiscountStatus: STATUS.FAILED });

      ErrorAlert(data?.data?.message);
    }
  },
  deleteAssignDiscountAction: async (payload) => {
    set({ deleteAssignDiscountStatus: STATUS.FETCHING });
    const data = await apis.deleteAssignDiscountApi(payload);
    if (data?.data?.action === true) {
      const prev = get().assignedDiscount;
      set({
        assignedDiscount: filter(prev, (d) => d.id !== payload),
        deleteAssignDiscountStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ deleteAssignDiscountStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  deleteFeesAction: async (payload) => {
    set({ deleteFeesStatus: STATUS.FETCHING });
    const data = await apis.deleteStudentFee(payload);
    if (data?.data?.action === true) {
      set({
        deleteFeesStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ deleteFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addSiblingAction: async (payload) => {
    set({ addSiblingStatus: STATUS.FETCHING });
    const data = await apis.addSiblingApi(payload);
    if (data?.data?.action === true) {
      set({
        addSiblingStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ addSiblingStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  updateCollectFeesAction: async (payload) => {
    set({ updateCollectFeesStatus: STATUS.FETCHING });
    const data = await apis.updateCollectSingleFeesApi(payload);
    if (data?.data?.action === true) {
      set({ updateCollectFeesStatus: STATUS.SUCCESS });
      SuccessAlert(data.data.message);
    } else {
      set({ updateCollectFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  deleteCollectFeesAction: async (payload) => {
    set({ deleteCollectFeesStatus: STATUS.FETCHING });
    const data = await apis.deleteCollectSingleFeesApi(payload);
    if (data?.data?.action === true) {
      set({ deleteCollectFeesStatus: STATUS.SUCCESS });
      SuccessAlert(data.data.message);
    } else {
      set({ deleteCollectFeesStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getAllSiblingsAction: async (payload) => {
    set({ getAllSiblingsStatus: STATUS.FETCHING });
    const data = await apis.getAllSiblingsApi(payload);
    if (data?.data?.action === true) {
      set({
        allSiblings: data.data.data,
        getAllSiblingsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getAllSiblingsStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  deleteSibling: async (payload) => {
    set({ deleteSiblingStatus: STATUS.FETCHING });
    const data = await apis.deleteSibling(payload);
    if (data?.data?.action === true) {
      set({
        deleteSiblingStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ deleteSiblingStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  getSiblingsAction: async (payload) => {
    set({ getSiblingsStatus: STATUS.FETCHING });
    const data = await apis.getSiblingsApi(payload);
    if (data?.data?.action === true) {
      set({
        siblings: data.data.data,
        getSiblingsStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getSiblingsStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  getOpeningStudAction: async (payload) => {
    set({ getOpeningStudStatus: STATUS.FETCHING });
    const data = await apis.getOpeningStudApi(payload);
    if (data?.data?.action === true) {
      set({
        openingStud: data.data.data,
        getOpeningStudStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getOpeningStudStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  addOpeningStudAction: async (payload) => {
    set({ addOpeningStudStatus: STATUS.FETCHING });
    const data = await apis.addOpeningStudApi(payload);
    if (data?.data?.action === true) {
      set({
        addOpeningStudStatus: STATUS.SUCCESS,
      });
      SuccessAlert(data.data.message);
    } else {
      set({ addOpeningStudStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },

  tcCreateAction: async (payload) => {
    set({ tcStudentStatus: STATUS.FETCHING });
    const data = await apis.restrictStudentApi(payload);
    if (data?.data?.action === true) {
      set({ tcStudentStatus: STATUS.SUCCESS });
      SuccessAlert(data?.data?.message);
    } else {
      set({ tcStudentStatus: STATUS.FAILED });
      ErrorAlert(data?.data?.message);
    }
  },
  tccResetAction: async () => {
    set({
      tcStudentStatus: STATUS.NOT_STARTED,
    });
  },

  getMarksheetAction: async (payload) => {
    set({ getMarksheetStatus: STATUS.FETCHING });
    const data = await apis.getMarksheetApi(payload);

    if (data?.data?.action === true) {
      set({
        getMarksheetdata: data.data.data,
        getMarksheetStatus: STATUS.SUCCESS,
      });
    } else {
      set({ getOpenFeesReceiptStatus: STATUS.FAILED });
      ErrorAlert(data.data?.message);
    }
  },
}));
