import { STATUS } from "@/constant";
import { apis } from "@/services/apis/apis";
import { ErrorAlert, SuccessAlert } from "@/utils/Helper";
import { concat, filter, map } from "lodash";
import { create } from "zustand";

export const useLibraryStore = create((set, get) => ({
    resetBookTypeStatus: async () => {
        set({
            addBookTypeStatus: STATUS.NOT_STARTED,
            updateBookTypeStatus: STATUS.NOT_STARTED,
            deleteBookTypeStatus: STATUS.NOT_STARTED
        })
    },

    resetVendorStatus: async () => {
        set({
            addVendorStatus: STATUS.NOT_STARTED,
            updateVendorStatus: STATUS.NOT_STARTED,
            deleteVendorStatus: STATUS.NOT_STARTED
        })
    },

    resetVendorData: async () => {
        set({
            getVendorStatus: STATUS.NOT_STARTED,
            allVendors: null
        })
    },

    resetCatalogStatus: async () => {
        set({
            addCatalogStatus: STATUS.NOT_STARTED,
            updateCatalogStatus: STATUS.NOT_STARTED,
            deleteCatalogStatus: STATUS.NOT_STARTED
        })
    },

    resetCatalogData: async () => {
        set({
            getCatalogStatus: STATUS.NOT_STARTED,
            allCatalogs: null,
            getCatalogDataStatus: STATUS.NOT_STARTED,
            allCatalogData: null
        })
    },

    resetBulkUploadCatalogData: async () => {
        set({
            bulkUploadCatalogStatus: STATUS.NOT_STARTED,
            bulkUploadCatalogs: null
        })
    },

    resetPurchaseEntryStatus: async () => {
        set({
            addPurchaseEntryStatus: STATUS.NOT_STARTED,
            updatePurchaseEntryStatus: STATUS.NOT_STARTED,
            deletePurchaseEntryStatus: STATUS.NOT_STARTED
        })
    },

    resetPurchaseEntryData: async () => {
        set({
            getPurchaseEntryStatus: STATUS.NOT_STARTED,
            allPurchaseEntrys: null
        })
    },

    resetShelfLocationStatus: async () => {
        set({
            addShelfLocationStatus: STATUS.NOT_STARTED,
            updateShelfLocationStatus: STATUS.NOT_STARTED,
            deleteShelfLocationStatus: STATUS.NOT_STARTED
        })
    },

    resetShelfLocationData: async () => {
        set({
            getShelfLocationStatus: STATUS.NOT_STARTED,
            allShelfLocations: null
        })
    },

    resetLatePenaltyStatus: async () => {
        set({
            addLatePenaltyStatus: STATUS.NOT_STARTED,
            updateLatePenaltyStatus: STATUS.NOT_STARTED,
            deleteLatePenaltyStatus: STATUS.NOT_STARTED
        })
    },

    resetLatePenaltyData: async () => {
        set({
            getLatePenaltyStatus: STATUS.NOT_STARTED,
            allLatePenaltys: null
        })
    },

    resetAccessionStatus: async () => {
        set({
            addAccessionStatus: STATUS.NOT_STARTED,
            updateAccessionStatus: STATUS.NOT_STARTED,
            deleteAccessionStatus: STATUS.NOT_STARTED
        })
    },

    resetAccessionData: async () => {
        set({
            getAccessionStatus: STATUS.NOT_STARTED,
            allAccessions: null
        })
    },

    resetSearchAccession: async () => {
        set({
            getSearchAccessionStatus: STATUS.NOT_STARTED,
            allSearchAccessions: null
        })
    },

    resetBookIssueStatus: async () => {
        set({
            addBookIssueStatus: STATUS.NOT_STARTED,
            updateBookIssueStatus: STATUS.NOT_STARTED,
        })
    },

    resetBookIssueData: async () => {
        set({
            getBookIssueStatus: STATUS.NOT_STARTED,
            allBookIssues: null
        })
    },

    resetBookReturnStatus: async () => {
        set({
            addBookReturnStatus: STATUS.NOT_STARTED,
            updateBookReturnStatus: STATUS.NOT_STARTED,
        })
    },

    resetBookReturnData: async () => {
        set({
            getBookReturnStatus: STATUS.NOT_STARTED,
            allBookReturns: null
        })
    },

    resetCurrentStockData: async () => {
        set({
            getCurrentStockStatus: STATUS.NOT_STARTED,
            allCurrentStocks: null
        })
    },

    resetSearchBookData: async () => {
        set({
            getSearchBookStatus: STATUS.NOT_STARTED,
            allSearchBooks: null
        })
    },

    getBookTypeAction: async (payload) => {
        set({ getBookTypeStatus: STATUS.FETCHING });
        const { data } = await apis.getBookTypeApi(payload);
        if (data?.action === true) {
            set({
                allBookTypes: data.data,
                getBookTypeStatus: STATUS.SUCCESS
            })
        } else {
            set({ getBookTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addBookTypeAction: async (payload) => {
        set({ addBookTypeStatus: STATUS.FETCHING });
        const { data } = await apis.addBookTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allBookTypes
            set({
                allBookTypes: concat(prev, data.data),
                addBookTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addBookTypeStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateBookTypeAction: async (payload) => {
        set({ updateBookTypeStatus: STATUS.FETCHING });
        const { data } = await apis.updateBookTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allBookTypes
            set({
                allBookTypes: map(prev, c => c.id === data.data.id ? data.data : c),
                updateBookTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateBookTypeStatus: STATUS.FAILED })
        }
    },

    deleteBookTypeAction: async (payload) => {
        set({ deleteBookTypeStatus: STATUS.FETCHING });
        const { data } = await apis.deleteBookTypeApi(payload);
        if (data?.action === true) {
            const prev = get().allBookTypes
            set({
                allBookTypes: filter(prev, d => d.id !== payload),
                deleteBookTypeStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteBookTypeStatus: STATUS.FAILED })
        }
    },

    getCatalogAction: async (payload) => {
        set({ getCatalogStatus: STATUS.FETCHING });
        const { data } = await apis.getCatalogApi(payload);
        if (data?.action === true) {
            set({
                allCatalogs: data,
                getCatalogStatus: STATUS.SUCCESS
            })
        } else {
            set({ getCatalogStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getCatalogLimitAction: async (payload) => {
        set({ getCatalogLimitStatus: STATUS.FETCHING });
        const { data } = await apis.getCatalogLimitApi(payload);
        if (data?.action === true) {
            set({
                allCatalogLimit: data,
                getCatalogLimitStatus: STATUS.SUCCESS
            })
        } else {
            set({ getCatalogLimitStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addCatalogAction: async (payload) => {
        set({ addCatalogStatus: STATUS.FETCHING });
        const { data } = await apis.addCatalogApi(payload);
        if (data?.action === true) {
            const prev = get().allCatalogs
            set({
                allCatalogs: ({ ...prev, data: [...prev.data, data.data] }),
                addCatalogStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addCatalogStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateCatalogAction: async (payload) => {
        set({ updateCatalogStatus: STATUS.FETCHING });
        const { data } = await apis.updateCatalogApi(payload);
        if (data?.action === true) {
            const prev = get().allCatalogs
            set({
                allCatalogs: ({ ...prev, data: map(prev.data, c => c.id === data.data.id ? data.data : c) }),
                updateCatalogStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateCatalogStatus: STATUS.FAILED })
        }
    },

    deleteCatalogAction: async (payload) => {
        set({ deleteCatalogStatus: STATUS.FETCHING });
        const { data } = await apis.deleteCatalogApi(payload);
        if (data?.action === true) {
            const prev = get().allCatalogs
            set({
                allCatalogs: ({ ...prev, data: filter(prev.data, d => d.id !== payload) }),
                deleteCatalogStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteCatalogStatus: STATUS.FAILED })
        }
    },

    bulkUploadCatalogAction: async (payload) => {
        set({ bulkUploadCatalogStatus: STATUS.FETCHING });
        const { data } = await apis.bulkUploadCatalogApi(payload);
        if (data?.action === true) {
            set({
                bulkUploadCatalogs: data.data,
                bulkUploadCatalogStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ bulkUploadCatalogStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getVendorAction: async (payload) => {
        set({ getVendorStatus: STATUS.FETCHING });
        const { data } = await apis.getVendorApi(payload);
        if (data?.action === true) {
            set({
                allVendors: data.data,
                getVendorStatus: STATUS.SUCCESS
            })
        } else {
            set({ getVendorStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addVendorAction: async (payload) => {
        set({ addVendorStatus: STATUS.FETCHING });
        const { data } = await apis.addVendorApi(payload);
        if (data?.action === true) {
            const prev = get().allVendors
            set({
                allVendors: concat(prev, data.data),
                addVendorStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addVendorStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateVendorAction: async (payload) => {
        set({ updateVendorStatus: STATUS.FETCHING });
        const { data } = await apis.updateVendorApi(payload);
        if (data?.action === true) {
            const prev = get().allVendors
            set({
                allVendors: map(prev, c => c.id === data.data.id ? data.data : c),
                updateVendorStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateVendorStatus: STATUS.FAILED })
        }
    },

    deleteVendorAction: async (payload) => {
        set({ deleteVendorStatus: STATUS.FETCHING });
        const { data } = await apis.deleteVendorApi(payload);
        if (data?.action === true) {
            const prev = get().allVendors
            set({
                allVendors: filter(prev, d => d.id !== payload),
                deleteVendorStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteVendorStatus: STATUS.FAILED })
        }
    },

    getPurchaseEntryAction: async (payload) => {
        set({ getPurchaseEntryStatus: STATUS.FETCHING });
        const { data } = await apis.getPurchaseEntryApi(payload);
        if (data?.action === true) {
            set({
                allPurchaseEntrys: data,
                getPurchaseEntryStatus: STATUS.SUCCESS
            })
        } else {
            set({ getPurchaseEntryStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addPurchaseEntryAction: async (payload) => {
        set({ addPurchaseEntryStatus: STATUS.FETCHING });
        const { data } = await apis.addPurchaseEntryApi(payload);
        if (data?.action === true) {
            const prev = get().allPurchaseEntrys
            set({
                allPurchaseEntrys: ({ ...prev, data: [...prev.data, data.data] }),
                addPurchaseEntryStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addPurchaseEntryStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updatePurchaseEntryAction: async (payload) => {
        set({ updatePurchaseEntryStatus: STATUS.FETCHING });
        const { data } = await apis.updatePurchaseEntryApi(payload);
        if (data?.action === true) {
            const prev = get().allPurchaseEntrys
            set({
                allPurchaseEntrys:({ ...prev, data: map(prev.data, c => c.id === data.data.id ? data.data : c) }),
                updatePurchaseEntryStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updatePurchaseEntryStatus: STATUS.FAILED })
        }
    },

    deletePurchaseEntryAction: async (payload) => {
        set({ deletePurchaseEntryStatus: STATUS.FETCHING });
        const { data } = await apis.deletePurchaseEntryApi(payload);
        if (data?.action === true) {
            const prev = get().allPurchaseEntrys
            set({
                allPurchaseEntrys: { ...prev, data: filter(prev.data, d => d.id !== payload) },
                deletePurchaseEntryStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deletePurchaseEntryStatus: STATUS.FAILED })
        }
    },

    getShelfLocationAction: async (payload) => {
        set({ getShelfLocationStatus: STATUS.FETCHING });
        const { data } = await apis.getShelfLocationApi(payload);
        if (data?.action === true) {
            set({
                allShelfLocations: data.data,
                getShelfLocationStatus: STATUS.SUCCESS
            })
        } else {
            set({ getShelfLocationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addShelfLocationAction: async (payload) => {
        set({ addShelfLocationStatus: STATUS.FETCHING });
        const { data } = await apis.addShelfLocationApi(payload);
        if (data?.action === true) {
            const prev = get().allShelfLocations
            set({
                allShelfLocations: concat(prev, data.data),
                addShelfLocationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addShelfLocationStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateShelfLocationAction: async (payload) => {
        set({ updateShelfLocationStatus: STATUS.FETCHING });
        const { data } = await apis.updateShelfLocationApi(payload);
        if (data?.action === true) {
            const prev = get().allShelfLocations
            set({
                allShelfLocations: map(prev, c => c.id === data.data.id ? data.data : c),
                updateShelfLocationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateShelfLocationStatus: STATUS.FAILED })
        }
    },

    deleteShelfLocationAction: async (payload) => {
        set({ deleteShelfLocationStatus: STATUS.FETCHING });
        const { data } = await apis.deleteShelfLocationApi(payload);
        if (data?.action === true) {
            const prev = get().allShelfLocations
            set({
                allShelfLocations: filter(prev, d => d.id !== payload),
                deleteShelfLocationStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteShelfLocationStatus: STATUS.FAILED })
        }
    },

    getLatePenaltyAction: async (payload) => {
        set({ getLatePenaltyStatus: STATUS.FETCHING });
        const { data } = await apis.getLatePenaltyApi(payload);
        if (data?.action === true) {
            set({
                allLatePenaltys: data.data,
                getLatePenaltyStatus: STATUS.SUCCESS
            })
        } else {
            set({ getLatePenaltyStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addLatePenaltyAction: async (payload) => {
        set({ addLatePenaltyStatus: STATUS.FETCHING });
        const { data } = await apis.addLatePenaltyApi(payload);
        if (data?.action === true) {
            const prev = get().allLatePenaltys
            set({
                allLatePenaltys: concat(prev, data.data),
                addLatePenaltyStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addLatePenaltyStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateLatePenaltyAction: async (payload) => {
        set({ updateLatePenaltyStatus: STATUS.FETCHING });
        const { data } = await apis.updateLatePenaltyApi(payload);
        if (data?.action === true) {
            const prev = get().allLatePenaltys
            set({
                allLatePenaltys: map(prev, c => c.id === data.data.id ? data.data : c),
                updateLatePenaltyStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateLatePenaltyStatus: STATUS.FAILED })
        }
    },

    deleteLatePenaltyAction: async (payload) => {
        set({ deleteLatePenaltyStatus: STATUS.FETCHING });
        const { data } = await apis.deleteLatePenaltyApi(payload);
        if (data?.action === true) {
            const prev = get().allLatePenaltys
            set({
                allLatePenaltys: filter(prev, d => d.id !== payload),
                deleteLatePenaltyStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteLatePenaltyStatus: STATUS.FAILED })
        }
    },

    getAccessionAction: async (payload) => {
        set({ getAccessionStatus: STATUS.FETCHING });
        const { data } = await apis.getAccessionApi(payload);
        if (data?.action === true) {
            set({
                allAccessions: data.data,
                getAccessionStatus: STATUS.SUCCESS
            })
        } else {
            set({ getAccessionStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getSearchAccessionAction: async (payload) => {
        set({ getSearchAccessionStatus: STATUS.FETCHING });
        const { data } = await apis.getSearchAccessionApi(payload);
        if (data?.action === true) {
            set({
                allSearchAccessions: data.data,
                getSearchAccessionStatus: STATUS.SUCCESS
            })
        } else {
            set({ getSearchAccessionStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getCatalogDataAction: async (payload) => {
        set({ getCatalogDataStatus: STATUS.FETCHING });
        const { data } = await apis.getCatalogDataApi(payload);
        if (data?.action === true) {
            set({
                allCatalogDatas: data.data,
                getCatalogDataStatus: STATUS.SUCCESS
            })
        } else {
            set({ getCatalogDataStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addAccessionAction: async (payload) => {
        set({ addAccessionStatus: STATUS.FETCHING });
        const { data } = await apis.addAccessionApi(payload);
        if (data?.action === true) {
            const prev = get().allAccessions
            set({
                allAccessions: concat(prev, data.data),
                addAccessionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addAccessionStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateAccessionAction: async (payload) => {
        set({ updateAccessionStatus: STATUS.FETCHING });
        const { data } = await apis.updateAccessionApi(payload);
        if (data?.action === true) {
            const prev = get().allAccessions
            set({
                allAccessions: map(prev, c => c.id === data.data.id ? data.data : c),
                updateAccessionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateAccessionStatus: STATUS.FAILED })
        }
    },

    deleteAccessionAction: async (payload) => {
        set({ deleteAccessionStatus: STATUS.FETCHING });
        const { data } = await apis.deleteAccessionApi(payload);
        if (data?.action === true) {
            const prev = get().allAccessions
            set({
                allAccessions: filter(prev, d => d.id !== payload),
                deleteAccessionStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ deleteAccessionStatus: STATUS.FAILED })
        }
    },

    getBookIssueAction: async (payload) => {
        set({ getBookIssueStatus: STATUS.FETCHING });
        const { data } = await apis.getBookIssueApi(payload);
        if (data?.action === true) {
            set({
                allBookIssues: data,
                getBookIssueStatus: STATUS.SUCCESS
            })
        } else {
            set({ getBookIssueStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addBookIssueAction: async (payload) => {
        set({ addBookIssueStatus: STATUS.FETCHING });
        const { data } = await apis.addBookIssueApi(payload);
        if (data?.action === true) {
            const prev = get().allBookIssues
            set({
                allBookIssues: ({ ...prev, data: [...prev.data, data.data] }),
                addBookIssueStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addBookIssueStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateBookIssueAction: async (payload) => {
        set({ updateBookIssueStatus: STATUS.FETCHING });
        const { data } = await apis.updateBookIssueApi(payload);
        if (data?.action === true) {
            const prev = get().allBookIssues
            set({
                allBookIssues: ({ ...prev, data: map(prev.data, c => c.id === data.data.id ? data.data : c) }),
                updateBookIssueStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateBookIssueStatus: STATUS.FAILED })
        }
    },

    getStdBookAction: async (payload) => {
        set({ getStdBookStatus: STATUS.FETCHING });
        const { data } = await apis.getStdBookApi(payload);
        if (data?.action === true) {
            set({
                allStdBooks: data.data,
                getStdBookStatus: STATUS.SUCCESS
            })
        } else {
            set({ getStdBookStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getBookReturnAction: async (payload) => {
        set({ getBookReturnStatus: STATUS.FETCHING });
        const { data } = await apis.getBookReturnApi(payload);
        if (data?.action === true) {
            set({
                allBookReturns: data,
                getBookReturnStatus: STATUS.SUCCESS
            })
        } else {
            set({ getBookReturnStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addBookReturnAction: async (payload) => {
        set({ addBookReturnStatus: STATUS.FETCHING });
        const { data } = await apis.addBookReturnApi(payload);
        if (data?.action === true) {
            const prev = get().allBookReturns
            set({
                allBookReturns: ({ ...prev, data: [...prev.data, data.data] }),
                addBookReturnStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ addBookReturnStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    updateBookReturnAction: async (payload) => {
        set({ updateBookReturnStatus: STATUS.FETCHING });
        const { data } = await apis.updateBookReturnApi(payload);
        if (data?.action === true) {
            const prev = get().allBookReturns
            set({
                allBookReturns: ({ ...prev, data: map(prev.data, c => c.id === data.data.id ? data.data : c) }),
                updateBookReturnStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ updateBookReturnStatus: STATUS.FAILED })
        }
    },

    bookSubmitAction: async (payload) => {
        set({ bookSubmitStatus: STATUS.FETCHING });
        const { data } = await apis.bookSubmitApi(payload);
        if (data?.action === true) {
            const prev = get().allBookIssues
            set({
                allBookIssues: map(prev, c => c.id === data.data.id ? data.data : c),
                bookSubmitStatus: STATUS.SUCCESS
            })
            SuccessAlert(data?.message)
        } else {
            set({ bookSubmitStatus: STATUS.FAILED })
        }
    },

    getCurrentStockAction: async (payload) => {
        set({ getCurrentStockStatus: STATUS.FETCHING });
        const { data } = await apis.getCurrentStockApi(payload);
        if (data?.action === true) {
            set({
                allCurrentStocks: data.data,
                getCurrentStockStatus: STATUS.SUCCESS
            })
        } else {
            set({ getCurrentStockStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    getSearchBookAction: async (payload) => {
        set({ getSearchBookStatus: STATUS.FETCHING });
        const { data } = await apis.getSearchBookApi(payload);
        if (data?.action === true) {
            set({
                allSearchBooks: data.data,
                getSearchBookStatus: STATUS.SUCCESS
            })
        } else {
            set({ getSearchBookStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },

    addPayGateWayAction: async (payload) => {
        set({ addPayGateWayStatus: STATUS.FETCHING });
        const { data } = await apis.addPayGateWayApi(payload);
        if (data?.action === true) {
            set({
                allPayGateWays: data.data,
                addPayGateWayStatus: STATUS.SUCCESS
            })
        } else {
            set({ addPayGateWayStatus: STATUS.FAILED })
            ErrorAlert(data?.message)
        }
    },
}))