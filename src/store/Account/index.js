import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useAccountStore = create((set, get) => ({
    resetVoucherNoStatus: async () => {
        set({
            getVoucherNoStatus: STATUS.NOT_STARTED,
            voucherNo: null
        })
    },
    resetExpenseTypeStatus: async () => {
        set({
            addExpenseTypeStatus: STATUS.NOT_STARTED,
            updateExpenseTypeStatus: STATUS.NOT_STARTED,
            deleteExpenseTypeStatus: STATUS.NOT_STARTED
        })
    },
    resetIncomeTypeStatus: async () => {
        set({
            addIncomeTypeStatus: STATUS.NOT_STARTED,
            updateIncomeTypeStatus: STATUS.NOT_STARTED,
            deleteIncomeTypeStatus: STATUS.NOT_STARTED
        })
    },
    resetLedgerStatus: async () => {
        set({
            addLedgerStatus: STATUS.NOT_STARTED,
            updateLedgerStatus: STATUS.NOT_STARTED,
            deleteLedgerStatus: STATUS.NOT_STARTED
        })
    },
    resetLedgerData: async () => {
        set({
            getLedgerStatus: STATUS.NOT_STARTED,
            allLedgers: [],
        })
    },
    resetPayableStatus: async () => {
        set({
            addPayableStatus: STATUS.NOT_STARTED,
            updatePayableStatus: STATUS.NOT_STARTED,
            deletePayableStatus: STATUS.NOT_STARTED
        })
    },
    resetPaymentVoucherStatus: async () => {
        set({
            addPaymentVoucherStatus: STATUS.NOT_STARTED,
            updatePaymentVoucherStatus: STATUS.NOT_STARTED,
            deletePaymentVoucherStatus: STATUS.NOT_STARTED
        })
    },
    resetReceiptVoucherStatus: async () => {
        set({
            addReceiptVoucherStatus: STATUS.NOT_STARTED,
            updateReceiptVoucherStatus: STATUS.NOT_STARTED,
            deleteReceiptVoucherStatus: STATUS.NOT_STARTED
        })
    },
    resetStatement: async () => {
        set({
            getStatementStatus: STATUS.NOT_STARTED,
            allStatement: [],
            closeingBalance: 0
        })
    },
    resetAccountBook: async () => {
        set({
            getAccountBookStatus: STATUS.NOT_STARTED,
            allAccountBook: [],
        })
    },
    resetPayableReport: async () => {
        set({
            getPayableReportStatus: STATUS.NOT_STARTED,
            allPayableReport: [],
        })
    },
    resetContraVoucherStatus: async () => {
        set({
            addContraVoucherStatus: STATUS.NOT_STARTED,
            updateContraVoucherStatus: STATUS.NOT_STARTED,
            deleteContraVoucherStatus: STATUS.NOT_STARTED
        })
    },
    resetContraVoucherData: async () => {
        set({
            getContraVoucherStatus: STATUS.NOT_STARTED,
            allContraVouchers: []
        })
    },
    resetGeneralVoucherStatus: async () => {
        set({
            addGeneralVoucherStatus: STATUS.NOT_STARTED,
            updateGeneralVoucherStatus: STATUS.NOT_STARTED,
            deleteGeneralVoucherStatus: STATUS.NOT_STARTED
        })
    },
    resetGeneralVoucherData: async () => {
        set({
            getGeneralVoucherStatus: STATUS.NOT_STARTED,
            allGeneralVouchers: []
        })
    },

    getVoucherNoAction: async (payload) => {
        set({ getVoucherNoStatus: STATUS.FETCHING });
        const { data } = await apis.getVoucherNoApi(payload);
        if (data?.action === true) {
            set({
                voucherNo: data,
                getVoucherNoStatus: STATUS.SUCCESS
            })
        } else {
            set({ getVoucherNoStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
    getLedgerDetailAction: async (payload) => {
        set({ getLedgerDetailStatus: STATUS.FETCHING });
        const { data } = await apis.getLedgerDetailApi(payload);
        if (data?.action === true) {
            set({
                getLedgerDetailStatus: STATUS.SUCCESS
            })
            if (payload.type == "mode") {
                set({ ledgerDetail: data })
            }
            if (payload.type == "ledger") {
                set({ MainLedgerDetail: data })
            }

        } else {
            set({ getLedgerDetailStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
    getExpenseTypeAction: async (payload) => {
        set({ getExpenseTypeStatus: STATUS.FETCHING });
        const { data } = await apis.getExpenseTypeApi(payload);
        if (data?.action === true) {
            set({
                allExpenseTypes: data.data,
                getExpenseTypeStatus: STATUS.SUCCESS
            })
        } else {
            set({ getExpenseTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addExpenseTypeAction: async (payload) => {
        set({ addExpenseTypeStatus: STATUS.FETCHING });
        const { data } = await apis.addExpenseTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allExpenseTypes
            set({
                allExpenseTypes: concat(prev, data.data),
                addExpenseTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addExpenseTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateExpenseTypeAction: async (payload) => {
        set({ updateExpenseTypeStatus: STATUS.FETCHING });
        const { data } = await apis.updateExpenseTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allExpenseTypes
            set({
                allExpenseTypes: map(prev, c => c.id === data.data.id ? data.data : c),
                updateExpenseTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateExpenseTypeStatus: STATUS.FAILED })
        }
    },

    deleteExpenseTypeAction: async (payload) => {
        set({ deleteExpenseTypeStatus: STATUS.FETCHING });
        const { data } = await apis.deleteExpenseTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allExpenseTypes
            set({
                allExpenseTypes: filter(prev, d => d.id !== payload),
                deleteExpenseTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteExpenseTypeStatus: STATUS.FAILED })
        }
    },

    getIncomeTypeAction: async (payload) => {
        set({ getIncomeTypeStatus: STATUS.FETCHING });
        const { data } = await apis.getIncomeTypeApi(payload);
        if (data?.action === true) {
            set({
                allIncomeTypes: data.data,
                getIncomeTypeStatus: STATUS.SUCCESS
            })
        } else {
            set({ getIncomeTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addIncomeTypeAction: async (payload) => {
        set({ addIncomeTypeStatus: STATUS.FETCHING });
        const { data } = await apis.addIncomeTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allIncomeTypes
            set({
                allIncomeTypes: concat(prev, data.data),
                addIncomeTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addIncomeTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateIncomeTypeAction: async (payload) => {
        set({ updateIncomeTypeStatus: STATUS.FETCHING });
        const { data } = await apis.updateIncomeTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allIncomeTypes
            set({
                allIncomeTypes: map(prev, c => c.id === data.data.id ? data.data : c),
                updateIncomeTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateIncomeTypeStatus: STATUS.FAILED })
        }
    },

    deleteIncomeTypeAction: async (payload) => {
        set({ deleteIncomeTypeStatus: STATUS.FETCHING });
        const { data } = await apis.deleteIncomeTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allIncomeTypes
            set({
                allIncomeTypes: filter(prev, d => d.id !== payload),
                deleteIncomeTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteIncomeTypeStatus: STATUS.FAILED })
        }
    },

    getLedgerAction: async (payload) => {
        set({ getLedgerStatus: STATUS.FETCHING });
        const { data } = await apis.getLedgerApi(payload);
        if (data?.action === true) {
            set({
                allLedgers: data.data,
                getLedgerStatus: STATUS.SUCCESS
            })
        } else {
            set({ getLedgerStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addLedgerAction: async (payload) => {
        set({ addLedgerStatus: STATUS.FETCHING });
        const { data } = await apis.addLedgerApi(payload);
        if (data?.action === true) {
            const prev = get().allLedgers
            set({
                allLedgers: concat(prev, data.data),
                addLedgerStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addLedgerStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateLedgerAction: async (payload) => {
        set({ updateLedgerStatus: STATUS.FETCHING });
        const { data } = await apis.updateLedgerApi(payload);
        if (data?.action === true) {
            const prev = get().allLedgers
            set({
                allLedgers: map(prev, c => c.id === data.data.id ? data.data : c),
                updateLedgerStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateLedgerStatus: STATUS.FAILED })
        }
    },

    deleteLedgerAction: async (payload) => {
        set({ deleteLedgerStatus: STATUS.FETCHING });
        const { data } = await apis.deleteLedgerApi(payload);
        if (data?.action === true) {
            const prev = get().allLedgers
            set({
                allLedgers: filter(prev, d => d.id !== payload),
                deleteLedgerStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteLedgerStatus: STATUS.FAILED })
        }
    },

    getPayableAction: async (payload) => {
        set({ getPayableStatus: STATUS.FETCHING });
        const { data } = await apis.getPayableApi(payload);
        if (data?.action === true) {
            set({
                allPayables: data.data,
                getPayableStatus: STATUS.SUCCESS
            })
        } else {
            set({ getPayableStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addPayableAction: async (payload) => {
        set({ addPayableStatus: STATUS.FETCHING });
        const { data } = await apis.addPayableApi(payload);
        if (data?.action === true) {
            const prev = get().allPayables
            set({
                allPayables: concat(prev, data.data),
                addPayableStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addPayableStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updatePayableAction: async (payload) => {
        set({ updatePayableStatus: STATUS.FETCHING });
        const { data } = await apis.updatePayableApi(payload);
        if (data?.action === true) {
            const prev = get().allPayables
            set({
                allPayables: map(prev, c => c.id === data.data.id ? data.data : c),
                updatePayableStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updatePayableStatus: STATUS.FAILED })
        }
    },

    deletePayableAction: async (payload) => {
        set({ deletePayableStatus: STATUS.FETCHING });
        const { data } = await apis.deletePayableApi(payload);
        if (data?.action === true) {
            const prev = get().allPayables
            set({
                allPayables: filter(prev, d => d.id !== payload),
                deletePayableStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deletePayableStatus: STATUS.FAILED })
        }
    },

    getPayableReportAction: async (payload) => {
        set({ getPayableReportStatus: STATUS.FETCHING });
        const { data } = await apis.getPayableReportApi(payload);
        if (data?.action === true) {
            set({
                allPayableReport: data.data,
                getPayableReportStatus: STATUS.SUCCESS
            })
        } else {
            set({ getPayableReportStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getPaymentVoucherAction: async (payload) => {
        set({ getPaymentVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.getPaymentVoucherApi(payload);
        if (data?.action === true) {
            set({
                allPaymentVouchers: data.data,
                getPaymentVoucherStatus: STATUS.SUCCESS
            })
        } else {
            set({ getPaymentVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addPaymentVoucherAction: async (payload) => {
        set({ addPaymentVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.addPaymentVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allPaymentVouchers
            set({
                allPaymentVouchers: concat(prev, data.data),
                addPaymentVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addPaymentVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updatePaymentVoucherAction: async (payload) => {
        set({ updatePaymentVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.updatePaymentVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allPaymentVouchers
            set({
                allPaymentVouchers: map(prev, c => c.id === data.data.id ? data.data : c),
                updatePaymentVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updatePaymentVoucherStatus: STATUS.FAILED })
        }
    },

    deletePaymentVoucherAction: async (payload) => {
        set({ deletePaymentVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.deletePaymentVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allPaymentVouchers
            set({
                allPaymentVouchers: filter(prev, d => d.id !== payload),
                deletePaymentVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deletePaymentVoucherStatus: STATUS.FAILED })
        }
    },

    getReceiptVoucherAction: async (payload) => {
        set({ getReceiptVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.getReceiptVoucherApi(payload);
        if (data?.action === true) {
            set({
                allReceiptVouchers: data.data,
                getReceiptVoucherStatus: STATUS.SUCCESS
            })
        } else {
            set({ getReceiptVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addReceiptVoucherAction: async (payload) => {
        set({ addReceiptVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.addReceiptVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allReceiptVouchers
            set({
                allReceiptVouchers: concat(prev, data.data),
                addReceiptVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addReceiptVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateReceiptVoucherAction: async (payload) => {
        set({ updateReceiptVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.updateReceiptVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allReceiptVouchers
            set({
                allReceiptVouchers: map(prev, c => c.id === data.data.id ? data.data : c),
                updateReceiptVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateReceiptVoucherStatus: STATUS.FAILED })
        }
    },

    deleteReceiptVoucherAction: async (payload) => {
        set({ deleteReceiptVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.deleteReceiptVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allReceiptVouchers
            set({
                allReceiptVouchers: filter(prev, d => d.id !== payload),
                deleteReceiptVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteReceiptVoucherStatus: STATUS.FAILED })
        }
    },

    getExpenseDataAction: async (payload) => {
        set({ getExpenseDataStatus: STATUS.FETCHING });
        const { data } = await apis.getExpenseDataApi(payload);
        if (data?.action === true) {
            set({
                allExpenseData: data.data,
                getExpenseDataStatus: STATUS.SUCCESS
            })
        } else {
            set({ getExpenseDataStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getStatementAction: async (payload) => {
        set({ getStatementStatus: STATUS.FETCHING });
        const { data } = await apis.getStatementApi(payload);
        if (data?.action === true) {
            set({
                allStatement: data.data,
                closeingBalance: data,
                getStatementStatus: STATUS.SUCCESS
            })
        } else {
            set({ getStatementStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getAccountBookAction: async (payload) => {
        set({ getAccountBookStatus: STATUS.FETCHING });
        const { data } = await apis.getAccountBookApi(payload);
        if (data?.action === true) {
            set({
                allAccountBook: data.data,
                getAccountBookStatus: STATUS.SUCCESS
            })
        } else {
            set({ getAccountBookStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
    resetCashBook: async () => {
        set({
            getCashBookStatus: STATUS.NOT_STARTED,
            allCashBook: [],
        })
    },
    getCashBookAction: async (payload) => {
        set({ getCashBookStatus: STATUS.FETCHING });
        const { data } = await apis.getCashBookApi(payload);
        if (data?.action === true) {
            set({
                allCashBook: data.data,
                getCashBookStatus: STATUS.SUCCESS
            })
        } else {
            set({ getCashBookStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getContraVoucherAction: async (payload) => {
        set({ getContraVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.getContraVoucherApi(payload);
        if (data?.action === true) {
            set({
                allContraVouchers: data.data,
                getContraVoucherStatus: STATUS.SUCCESS
            })
        } else {
            set({ getContraVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addContraVoucherAction: async (payload) => {
        set({ addContraVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.addContraVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allContraVouchers
            set({
                allContraVouchers: concat(prev, data.data),
                addContraVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addContraVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateContraVoucherAction: async (payload) => {
        set({ updateContraVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.updateContraVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allContraVouchers
            set({
                allContraVouchers: map(prev, c => c.id === data.data.id ? data.data : c),
                updateContraVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateContraVoucherStatus: STATUS.FAILED })
        }
    },

    deleteContraVoucherAction: async (payload) => {
        set({ deleteContraVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.deleteContraVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allContraVouchers
            set({
                allContraVouchers: filter(prev, d => d.id !== payload),
                deleteContraVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteContraVoucherStatus: STATUS.FAILED })
        }
    },

    getGeneralVoucherAction: async (payload) => {
        set({ getGeneralVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.getGeneralVoucherApi(payload);
        if (data?.action === true) {
            set({
                allGeneralVouchers: data.data,
                getGeneralVoucherStatus: STATUS.SUCCESS
            })
        } else {
            set({ getGeneralVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addGeneralVoucherAction: async (payload) => {
        set({ addGeneralVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.addGeneralVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allGeneralVouchers
            set({
                allGeneralVouchers: concat(prev, data.data),
                addGeneralVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addGeneralVoucherStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateGeneralVoucherAction: async (payload) => {
        set({ updateGeneralVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.updateGeneralVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allGeneralVouchers
            set({
                allGeneralVouchers: map(prev, c => c.id === data.data.id ? data.data : c),
                updateGeneralVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateGeneralVoucherStatus: STATUS.FAILED })
        }
    },

    deleteGeneralVoucherAction: async (payload) => {
        set({ deleteGeneralVoucherStatus: STATUS.FETCHING });
        const { data } = await apis.deleteGeneralVoucherApi(payload);
        if (data?.action === true) {
            const prev = get().allGeneralVouchers
            set({
                allGeneralVouchers: filter(prev, d => d.id !== payload),
                deleteGeneralVoucherStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteGeneralVoucherStatus: STATUS.FAILED })
        }
    },
}))