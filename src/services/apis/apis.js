import { omit } from "lodash";
import { URIS, apiJson, apiMultipart } from ".";

export const apis = {
    loginApi: (payload) => apiJson.post(URIS.LOGIN, payload),
    findMeApi: () => apiJson.get(URIS.FIND_ME),

    forgotPasswordApi: (payload) => apiJson.post(URIS.FORGOT_PASSWORD, payload),
    ResendVerificationApi: (payload) =>
        apiJson.post(URIS.RESET_PASSWORD, payload),
    sysadminLoginApi: (payload) => apiJson.post(URIS.SYSADMIN_LOGIN, payload),
    defaultSessionApi: (payload) => apiJson.get(URIS.DEFAULT_SESSION, payload),
    getAdminBankApi: (payload) => apiJson.get(URIS.GET_ADMIN_BANKS, payload),
    addAdminBankApi: (payload) => apiJson.post(URIS.ADD_ADMIN_BANKS, payload),
    updateAdminBankApi: (payload) =>
        apiJson.put(URIS.GET_ADMIN_BANKS + "/" + payload.id, {
            name: payload.name,
        }),
    deleteAdminBankApi: (payload) =>
        apiJson.delete(URIS.GET_ADMIN_BANKS + "/" + payload),

    dashboardApi: (payload) => apiJson.post(URIS.DASHBOARD, payload),
    fetchExtraDashboardInfoApi: (payload) =>
        apiJson.post(URIS.EXTRA_INFO_DASHBOARD, payload),

    changePassApi: (payload) => apiJson.post(URIS.CHANGE_PASS, payload),
    updateNowApi: (payload) => apiJson.get(URIS.UPDATE_NOW, payload),

    // Common
    getStateApi: (payload) => apiJson.get(URIS.GET_STATE, payload),
    getDistrictApi: (payload) => apiJson.get(URIS.GET_DISTRICT + "/" + payload),

    // SysAdmin
    getClientRegApi: (payload) => apiJson.post(URIS.CLIENT, payload),
    addClientRegApi: (payload) => apiJson.post(URIS.ADD_CLIENT, payload),
    putClientRegApi: (payload) =>
        apiJson.put(URIS.CLIENT + "/" + payload.id, payload),
    deleteClientRegApi: (payload) => apiJson.delete(URIS.CLIENT + "/" + payload),
    getAppRequestApi: (payload) => apiJson.get(URIS.APP_REQUEST, payload),
    getOrderRequestApi: (payload) => apiJson.post(URIS.ORDER_REQUEST, payload),
    addAppRequestApi: (payload) => apiJson.post(URIS.ADD_APP_REQUEST, payload),
    putAppRequestApi: (payload) =>
        apiJson.put(URIS.APP_REQUEST + "/" + payload.id, payload),
    deleteAppRequestApi: (payload) =>
        apiJson.delete(URIS.APP_REQUEST + "/" + payload),
    getAppClientApi: (payload) => apiJson.post(URIS.APP_CLIENT, payload),
    addAppClientApi: (payload) => apiJson.post(URIS.ADD_APP_CLIENT, payload),
    putAppClientApi: (payload) =>
        apiJson.put(URIS.APP_CLIENT + "/" + payload.id, payload),
    deleteAppClientApi: (payload) =>
        apiJson.delete(URIS.APP_CLIENT + "/" + payload),
    getSchoolPermissionApi: (payload) =>
        apiJson.get(URIS.SCHOOL_PERMISSION, { params: payload }),
    addSchoolPermissionApi: (payload) =>
        apiJson.post(URIS.ADD_SCHOOL_PERMISSION, payload),
    updateSchoolPermissionApi: (payload) =>
        apiJson.put(URIS.SCHOOL_PERMISSION + "/" + payload.id, payload),
    deleteSchoolPermissionApi: (payload) =>
        apiJson.delete(URIS.SCHOOL_PERMISSION + "/" + payload),

    //Master
    getClassDetailApi: (payload) => apiJson.get(URIS.CLASS_DETAILS, payload),

    getClassApi: (payload) => apiJson.get(URIS.CLASS, payload),
    addClassApi: (payload) => apiJson.post(URIS.ADD_CLASS, payload),
    putClassApi: (payload) =>
        apiJson.put(URIS.CLASS + "/" + payload.id, {
            name: payload.name,
            orderNo: payload.orderNo,
        }),
    deleteClassApi: (payload) => apiJson.delete(URIS.CLASS + "/" + payload),

    getStreamApi: (payload) => apiJson.get(URIS.STREAM, payload),
    getStreamOnlineApi: (payload) => apiJson.post(URIS.STREAM_ONLINE, payload),

    addStreamApi: (payload) => apiJson.post(URIS.ADD_STREAM, payload),
    putStreamApi: (payload) =>
        apiJson.put(URIS.STREAM + "/" + payload.id, { name: payload.name }),
    deleteStreamApi: (payload) => apiJson.delete(URIS.STREAM + "/" + payload),

    getSectionApi: (payload) => apiJson.get(URIS.SECTION, payload),
    getSectionOnlineApi: (payload) => apiJson.post(URIS.SECTION_ONLINE, payload),


    addSectionApi: (payload) => apiJson.post(URIS.ADD_SECTION, payload),

    //banner
    getBannerApi: (payload) => apiJson.post(URIS.ADD_HIGHLIGHT, payload),

    deleteBannerApi: (payload) =>
        apiJson.delete(URIS.ADD_HIGHLIGHT + "/" + payload),
    addHighlightApi: (payload) =>
        apiMultipart.post(URIS.ADD_HIGHLIGHT + "/add", payload),
    putSectionApi: (payload) =>
        apiJson.put(URIS.SECTION + "/" + payload.id, {
            name: payload.name,
            orderNo: payload.orderNo,
        }),
    deleteSectionApi: (payload) => apiJson.delete(URIS.SECTION + "/" + payload),

    getSubjectApi: (payload) => apiJson.get(URIS.SUBJECT, payload),
    addSubjectApi: (payload) => apiJson.post(URIS.ADD_SUBJECT, payload),
    putSubjectApi: (payload) =>
        apiJson.put(URIS.SUBJECT + "/" + payload.id, { name: payload.name }),
    deleteSubjectApi: (payload) => apiJson.delete(URIS.SUBJECT + "/" + payload),

    getClassSubjectApi: (payload) => apiJson.post(URIS.CLASS_SUBJECT, payload),
    getClassSubjectOnlineApi: (payload) => apiJson.post(URIS.CLASS_SUBJECT_ONLINE, payload),

    addClassSubjectApi: (payload) =>
        apiJson.post(URIS.ADD_CLASS_SUBJECT, payload),

    addColorCodeApi: (payload) => apiJson.post(URIS.COLOR_CODE, payload),
    putClassSubjectApi: (payload) =>
        apiJson.put(URIS.CLASS_SUBJECT + "/" + payload.id, payload),
    deleteClassSubjectApi: (payload) =>
        apiJson.delete(URIS.CLASS_SUBJECT + "/" + payload),

    getFeesNameApi: (payload) => apiJson.get(URIS.FEES_NAME, payload),
    addFeesNameApi: (payload) => apiJson.post(URIS.ADD_FEES_NAME, payload),
    putFeesNameApi: (payload) =>
        apiJson.put(URIS.FEES_NAME + "/" + payload.id, payload),
    updateGeneralSettingsApi: (payload) =>
        apiJson.post(URIS.UPDATE_FEES_GENERAL, payload),
    deleteFeesNameApi: (payload) =>
        apiJson.delete(URIS.FEES_NAME + "/" + payload),

    getFeesGroupApi: (payload) => apiJson.get(URIS.FEES_GROUP, payload),
    getGeneralSettingsApi: () => apiJson.get(URIS.GET_GENERAL_SETTING),
    addFeesGroupApi: (payload) => apiJson.post(URIS.ADD_FEES_GROUP, payload),
    putFeesGroupApi: (payload) =>
        apiJson.put(URIS.FEES_GROUP + "/" + payload.id, { name: payload.name }),
    deleteFeesGroupApi: (payload) =>
        apiJson.delete(URIS.FEES_GROUP + "/" + payload),

    getAssignFeesApi: (payload) => apiJson.post(URIS.ASSIGN_FEES, payload),
    getAssignFeesOnlineApi: (payload) => apiJson.post(URIS.ASSIGN_FEES_ONLINE, payload),

    addAssignFeesApi: (payload) => apiJson.post(URIS.ADD_ASSIGN_FEES, payload),
    putAssignFeesApi: (payload) =>
        apiJson.put(URIS.ASSIGN_FEES + "/" + payload.id, payload),
    deleteAssignFeesApi: (payload) =>
        apiJson.delete(URIS.ASSIGN_FEES + "/" + payload),

    getDiscountMasterApi: (payload) =>
        apiJson.post(URIS.DISCOUNT_MASTER, payload),
    addDiscountMasterApi: (payload) =>
        apiJson.post(URIS.ADD_DISCOUNT_MASTER, payload),
    putDiscountMasterApi: (payload) =>
        apiJson.put(URIS.DISCOUNT_MASTER + "/" + payload.id, payload),
    deleteDiscountMasterApi: (payload) =>
        apiJson.delete(URIS.DISCOUNT_MASTER + "/" + payload),

    getBrocherFeesApi: (payload) => apiJson.post(URIS.BROCHER_FEES, payload),
    editBrocherFeesApi: (payload) =>
        apiJson.post(URIS.EDIT_BROCHER_FEES, payload),

    getSessionApi: (payload) => apiJson.get(URIS.SESSION, payload),
    addSessionApi: (payload) => apiJson.post(URIS.ADD_SESSION, payload),
    putSessionApi: (payload) =>
        apiJson.put(URIS.SESSION + "/" + payload.id, payload),
    deleteSessionApi: (payload) => apiJson.delete(URIS.SESSION + "/" + payload),

    getHouseApi: (payload) => apiJson.get(URIS.HOUSE, payload),
    getHouseoOnlineApi: (payload) => apiJson.post(URIS.HOUSE_ONLINE, payload),

    addHouseApi: (payload) => apiJson.post(URIS.ADD_HOUSE, payload),
    putHouseApi: (payload) =>
        apiJson.put(URIS.HOUSE + "/" + payload.id, { name: payload.name }),
    deleteHouseApi: (payload) => apiJson.delete(URIS.HOUSE + "/" + payload),

    getdesignationApi: (payload) => apiJson.get(URIS.DESIGNATION, payload),
    adddesignationApi: (payload) => apiJson.post(URIS.ADD_DESIGNATION, payload),
    putdesignationApi: (payload) =>
        apiJson.put(URIS.DESIGNATION + "/" + payload.id, { name: payload.name }),
    deletedesignationApi: (payload) =>
        apiJson.delete(URIS.DESIGNATION + "/" + payload),

    getBankApi: (payload) => apiJson.get(URIS.BANK, payload),
    addBankApi: (payload) => apiJson.post(URIS.ADD_BANK, payload),
    putBankApi: (payload) => apiJson.put(URIS.BANK + "/" + payload.id, payload),
    deleteBankApi: (payload) => apiJson.delete(URIS.BANK + "/" + payload),

    getClassDocumentApi: (payload) => apiJson.get(URIS.CLASS_DOCUMENT, payload),
    addClassDocumentApi: (payload) =>
        apiJson.post(URIS.ADD_CLASS_DOCUMENT, payload),
    updateExpiryDateApi: (payload) =>
        apiJson.put(URIS.UPDATE_EXPIRY_DATE + payload.id, payload),
    putClassDocumentApi: (payload) =>
        apiJson.put(URIS.CLASS_DOCUMENT + "/" + payload.id, {
            name: payload.name,
            accountNumber: payload.accountNumber,
        }),
    deleteClassDocumentApi: (payload) =>
        apiJson.delete(URIS.CLASS_DOCUMENT + "/" + payload),
    addEnquiryApi: (payload) => apiJson.post(URIS.ADD_ENQUIRY, payload),
    getEnquiryApi: (payload) => apiJson.post(URIS.GET_ENQUIRY, payload),
    getOnlineAdmissionEnquiryApi: (payload) => apiJson.post(URIS.ONLINE_ADMISSION_LIST, payload),
    addPassApi: (payload) => apiJson.post(URIS.ADD_PASS, payload),
    getPassApi: (payload) => apiJson.post(URIS.GET_PASS, payload),
    deletePassApi: (payload) => apiJson.delete(URIS.DELETE_PASS + "/" + payload),
    getSingleEnquiryApi: (payload) =>
        apiJson.get(URIS.GET_ENQUIRY + "/" + payload),
    editEnquiryApi: (payload) =>
        apiJson.put(URIS.GET_ENQUIRY + "/" + payload.id, payload),
    deleteEnquiryApi: (payload) =>
        apiJson.delete(URIS.GET_ENQUIRY + "/" + payload),

    addStudentApi: (payload) => apiMultipart.post(URIS.ADD_STUDENT, payload),
    addStudentOnlineApi: (payload) => apiMultipart.post(URIS.ADD_STUDENT_ONLINE, payload),
    getSchoolInfoApi: (payload) => apiJson.post(URIS.SCHOOL_INFO, payload),

    editStudentApi: (payload) => apiMultipart.post(URIS.EDIT_STUDENT, payload),
    getAllStudentApi: (payload) => apiJson.post(URIS.GET_ALL_STUDENT, payload),
    deleteStudentApi: (payload) =>
        apiJson.delete(URIS.DELETE_STUDENT + "/" + payload),
    deleteMultipleStudentApi: (payload) =>
        apiJson.post(URIS.DELETE_MULTI_STUDENT, payload),
    hardDeleteStudentApi: (payload) =>
        apiJson.delete(URIS.HARD_DELETE_STUDENT + "/" + payload),
    restrictStudentApi: (payload) => apiJson.post(URIS.RESTRICT_STUDENT, payload),
    uploadStudentPicApi: (payload) =>
        apiMultipart.post(URIS.UPLOAD_STUDENT_PIC, payload),
    checkExistApi: (payload) => apiJson.post(URIS.CHECK_EXIST, payload),
    bulkAdmissionApi: (payload) => apiJson.post(URIS.BULK_ADMISSION, payload),
    getCustomStudentApi: (payload) =>
        apiJson.post(URIS.GET_CUSTOM_STUDENT, payload),
    getCategoryReportApi: (payload) =>
        apiJson.post(URIS.GET_CATEGORY_REPORT, payload),
    getStudentDetailsApi: (payload) =>
        apiJson.post(URIS.GET_STUDENT_DETAILS + "/" + payload.id, {
            sessionMasterId: payload.sessionMasterId,
        }),
    getFilterStudentsApi: (payload) =>
        apiJson.post(URIS.GET_FILTER_STUDENTS, payload),

    getSubjectWiseApi: (payload) => apiJson.post(URIS.GET_SUBJECT_WISE, payload),

    addFollowUpApi: (payload) => apiJson.post(URIS.ADD_FOLLOWUP, payload),
    getFollowUpApi: (payload) => apiJson.get(URIS.GET_FOLLOWUP + "/" + payload),

    addFeesFollowUpApi: (payload) => apiJson.post(URIS.ADD_FEES_FOLLOWUP, payload),
    getFeesFollowUpApi: (payload) => apiJson.get(URIS.GET_FEES_FOLLOWUP + "/" + payload),

    getFeesFollowUpDateWiseApi: (payload) => apiJson.post(URIS.GET_FEES_FOLLOWUP_DATEWISE, payload),
    searchStudentApi: (payload) => apiJson.post(URIS.SEARCH_STUDENT, payload),
    getStudentFeesApi: (payload) => apiJson.post(URIS.STUDENT_FEES, payload),
    makeStudentFeesRTEApi: (payload) =>
        apiJson.post(URIS.MAKE_STUDENT_FEES_RTE, payload),
    getFeesLedgerApi: (payload) => apiJson.post(URIS.FEES_LEDGER, payload),
    collectStdFeesApi: (payload) =>
        apiJson.post(URIS.COLLECT_STUDENT_FEES, payload),
    updateCollectFeesApi: (payload) =>
        apiJson.post(URIS.UPDATE_COLLECT_FEES, payload),
    updateCollectSingleFeesApi: (payload) =>
        apiJson.post(URIS.UPDATE_COLLECT_SINGLE_FEES, payload),
    deleteCollectSingleFeesApi: (payload) =>
        apiJson.post(URIS.DELETE_COLLECT_SINGLE_FEES, payload),
    getFeesReceiptApi: (payload) => apiJson.post(URIS.GET_FEES_RECEIPT, payload),
    getOpenFeesReceiptApi: (payload) =>
        apiJson.get(
            URIS.GET_OPEN_FEES_RECEIPT + "/" + payload.org + "/" + payload.receiptNo
        ),
    getCollectionsApi: (payload) => apiJson.post(URIS.GET_COLLECTIONS, payload),
    addCollectFeesApi: (payload) => apiJson.post(URIS.ADD_COLLECT_FEES, payload),
    cancelFeesApi: (payload) => apiJson.put(URIS.CANCEL_FEES, payload),
    getPendingFeesApi: (payload) => apiJson.post(URIS.GET_PENDING_FEES, payload),
    getClassWiseStudentApi: (payload) => apiJson.post(URIS.GET_STUDENTLIST_CLASS, payload),
    getPermotedStudentApi: (payload) =>
        apiJson.post(URIS.STUDENT_PROMOTE_LIST, payload),

    addStudentPromoteApi: (payload) =>
        apiJson.post(URIS.STUDENT_PROMOTE, payload),
    getFeesSummaryApi: (payload) => apiJson.post(URIS.GET_FEES_SUMMARY, payload),
    getClassSummaryApi: (payload) => apiJson.post(URIS.GET_CLASS_SUMMARY, payload),

    getChequeListApi: (payload) => apiJson.post(URIS.GET_CHEQUE_List, payload),
    updateChequeStatusApi: (payload) =>
        apiJson.post(URIS.UPDATE_CHEQUE_STATUS, payload),
    getDiscountApi: (payload) => apiJson.post(URIS.GET_DISCOUNT, payload),

    applyDiscountApi: (payload) => apiJson.post(URIS.APPLY_DISCOUNT, payload),
    getAssignDiscountApi: (payload) =>
        apiJson.post(URIS.GET_ASSIGN_DISCOUNT, payload),
    updateAssignDiscountApi: (payload) =>
        apiJson.put(URIS.UPDATE_ASSIGN_DISCOUNT + "/" + payload.id, payload),
    deleteAssignDiscountApi: (payload) =>
        apiJson.delete(URIS.UPDATE_ASSIGN_DISCOUNT + "/" + payload),
    deleteStudentFee: (payload) =>
        apiJson.post(URIS.DELETE_STUDENT_FEES, payload),
    addSiblingApi: (payload) => apiJson.post(URIS.ADD_SIBLING, payload),
    getAllSiblingsApi: (payload) => apiJson.post(URIS.GET_ALL_SIBLINGS, payload),

    deleteSibling: (payload) => apiJson.delete(URIS.GET_SIBLINGS + "/" + payload),
    getSiblingsApi: (payload) => apiJson.get(URIS.GET_SIBLINGS + "/" + payload),
    getOpeningStudApi: (payload) => apiJson.post(URIS.OPENING_STUDENT, payload),
    addOpeningStudApi: (payload) =>
        apiJson.post(URIS.ADD_OPENING_STUDENT, payload),

    getDailyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_DAY_WISE_ATTENDANCE, payload),
    getDayAttendApi: (payload) => apiJson.post(URIS.GET_DAY_WISE, payload),
    addDayAttendApi: (payload) => apiJson.post(URIS.DAY_WISE_ATTENDANCE, payload),
    getStdMonthAttApi: (payload) =>
        apiJson.post(URIS.GET_STUD_MONTH_ATTE, payload),
    getStaffMonthAttApi: (payload) =>
        apiJson.post(URIS.GET_STAFF_MONTH_ATTE, payload),
    getMonthlyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_MONTH_WISE_ATTENDANCE, payload),
    addMonthlyAttendanceApi: (payload) =>
        apiJson.post(URIS.MONTH_WISE_ATTENDANCE, payload),
    addMonthlyStaffAttendanceApi: (payload) =>
        apiJson.post(URIS.STAFF_MONTH_WISE_ATTENDANCE, payload),
    getYearlyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_YEAR_WISE_ATTENDANCE, payload),
    getBioAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_BIO_ATTENDANCE, payload),

    getBioStaffAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_BIO_STAFF_ATTENDANCE, payload),
    getSRListApi: (payload) => apiJson.post(URIS.GET_SR_LIST, payload),
    getStudentSRApi: (payload) =>
        apiJson.get(URIS.GET_STUDENT_SR + "/" + payload),
    updateSrApi: (payload) =>
        apiJson.put(URIS.GET_STUDENT_SR + "/" + payload.id, payload.data),

    // Exams
    getExamApi: (payload) => apiJson.get(URIS.EXAM, { params: payload }),
    addExamApi: (payload) => apiJson.post(URIS.ADD_EXAM, payload),
    updateExamApi: (payload) =>
        apiJson.put(URIS.EXAM + "/" + payload.id, payload),
    deleteExamApi: (payload) => apiJson.delete(URIS.EXAM + "/" + payload),
    getExamGroupApi: (payload) =>
        apiJson.get(URIS.EXAM_GROUP, { params: payload }),
    addExamGroupApi: (payload) => apiJson.post(URIS.ADD_EXAM_GROUP, payload),

    publishMarksheetGroupApi: (payload) =>
        apiJson.post(URIS.ADD_PUBLISH_GROUP, payload),
    getpublishMarksheetGroupApi: (payload) =>
        apiJson.post(URIS.PUBLISH_GROUP, payload),
    deletepublishMarksheetGroupApi: (payload) =>
        apiJson.delete(URIS.PUBLISH_GROUP + "/" + payload),
    updatepublishMarksheetGroupApi: (payload) =>
        apiJson.put(URIS.PUBLISH_GROUP + "/" + payload.id, payload),

    updateExamGroupApi: (payload) =>
        apiJson.put(URIS.EXAM_GROUP + "/" + payload.id, payload),
    deleteExamGroupApi: (payload) =>
        apiJson.delete(URIS.EXAM_GROUP + "/" + payload),
    addAssignExamApi: (payload) => apiJson.post(URIS.ADD_ASSIGN_EXAM, payload),
    getAssignExamApi: (payload) => apiJson.post(URIS.GET_ASSIGN_EXAM, payload),
    editAssignExamApi: (payload) =>
        apiJson.put(URIS.GET_ASSIGN_EXAM + "/" + payload.id, payload),
    deleteAssignExamApi: (payload) =>
        apiJson.delete(URIS.GET_ASSIGN_EXAM + "/" + payload),

    getResultStrucApi: (payload) => apiJson.get(URIS.RESULT_STRUCTURE, payload),
    updateResultStrucApi: (payload) =>
        apiJson.post(URIS.UPDATE_RESULT_STRUCTURE, payload),
    assignRollNoApi: (payload) => apiJson.post(URIS.ASSIGN_ROLLNO, payload),
    addExamTimeTableApi: (payload) =>
        apiJson.post(URIS.ADD_EXAM_TIMETABLE, payload),
    getExamTimeTableApi: (payload) => apiJson.post(URIS.EXAM_TIMETABLE, payload),
    editExamTimeTableApi: (payload) =>
        apiJson.put(URIS.EXAM_TIMETABLE + "/" + payload.id, payload),
    deleteExamTimeTableApi: (payload) =>
        apiJson.delete(URIS.EXAM_TIMETABLE + "/" + payload),
    addExamMarksApi: (payload) => apiJson.post(URIS.GET_EXAM_MARKS, payload),
    getExamMarksApi: (payload) => apiJson.post(URIS.EXAM_MARKS, payload),
    getMarkSheetApi: (payload) => apiJson.post(URIS.GET_MARKSHEET_DATA, payload),

    // Transport
    getStationByShiftApi: (payload) => apiJson.post(URIS.SHIFT_BY_ID, payload),
    getFuelIsshueApi: (payload) => apiJson.post(URIS.FUEL, payload),

    getStationApi: (payload) => apiJson.get(URIS.STATION, { params: payload }),
    addStationApi: (payload) => apiJson.post(URIS.ADD_STATION, payload),
    addFuelIsshuApi: (payload) => apiJson.post(URIS.ADD_FUEL, payload),
    updateFuelIsshueApi: (payload) =>
        apiJson.put(URIS.FUEL + "/" + payload.id, payload),
    deleteFuelApi: (payload) => apiJson.delete(URIS.FUEL + "/" + payload),
    updateStationApi: (payload) =>
        apiJson.put(URIS.STATION + "/" + payload.id, payload),
    deleteStationApi: (payload) => apiJson.delete(URIS.STATION + "/" + payload),
    getDriverApi: (payload) => apiJson.get(URIS.DRIVER, { params: payload }),
    addDriverApi: (payload) => apiMultipart.post(URIS.ADD_DRIVER, payload),
    updateDriverApi: (payload) =>
        apiMultipart.put(URIS.DRIVER + "/" + payload.id, payload),
    deleteDriverApi: (payload) => apiJson.delete(URIS.DRIVER + "/" + payload),
    getTransporterApi: (payload) =>
        apiJson.get(URIS.TRANSPORTER, { params: payload }),
    addTransporterApi: (payload) =>
        apiMultipart.post(URIS.ADD_TRANSPORTER, payload),
    updateTransporterApi: (payload) =>
        apiJson.put(URIS.TRANSPORTER + "/" + payload.id, {
            status: payload.status,
        }),
    deleteTransporterApi: (payload) =>
        apiJson.delete(URIS.TRANSPORTER + "/" + payload),
    getVehicleApi: (payload) => apiJson.get(URIS.VEHICLE, { params: payload }),
    addVehicleApi: (payload) => apiJson.post(URIS.ADD_VEHICLE, payload),
    updateVehicleApi: (payload) =>
        apiJson.put(URIS.VEHICLE + "/" + payload.id, payload),
    deleteVehicleApi: (payload) => apiJson.delete(URIS.VEHICLE + "/" + payload),
    getRouteApi: (payload) => apiJson.post(URIS.ROUTE, payload),
    getDashboardApi: (payload) => apiJson.post(URIS.TRANSPORT_DASHBOARD, payload),
    addRouteApi: (payload) => apiJson.post(URIS.ADD_ROUTE, payload),
    updateRouteApi: (payload) =>
        apiJson.put(URIS.ROUTE + "/" + payload.id, payload),
    deleteRouteApi: (payload) => apiJson.delete(URIS.ROUTE + "/" + payload),
    getFeesHeadApi: (payload) => apiJson.get(URIS.FEES_HEAD, { params: payload }),
    addFeesHeadApi: (payload) => apiJson.post(URIS.ADD_FEES_HEAD, payload),
    updateFeesHeadApi: (payload) =>
        apiJson.put(URIS.FEES_HEAD + "/" + payload.id, payload),
    deleteFeesHeadApi: (payload) =>
        apiJson.delete(URIS.FEES_HEAD + "/" + payload),
    getFeesDefineApi: (payload) => apiJson.post(URIS.FEES_DEFINE, payload),
    addFeesDefineApi: (payload) => apiJson.post(URIS.ADD_FEES_DEFINE, payload),
    updateFeesDefineApi: (payload) =>
        apiJson.put(URIS.FEES_DEFINE + "/" + payload.id, payload),
    deleteFeesDefineApi: (payload) =>
        apiJson.delete(URIS.FEES_DEFINE + "/" + payload),
    getCheckFeesApi: (payload) => apiJson.post(URIS.CHECK_FEES, payload),
    getStationFeesApi: (payload) => apiJson.post(URIS.STATION_FEES, payload),
    getRouteWiseReportApi: (payload) =>
        apiJson.post(URIS.ROUTE_WISE_REPORT, payload),

    //Transport Fees
    getStdRegistrationApi: (payload) =>
        apiJson.post(URIS.GET_STD_REGISTRATION, payload),
    getStdNonRegistrationApi: (payload) =>
        apiJson.post(URIS.GET_STD_NON_REGISTRATION, payload),
    addStdRegistrationApi: (payload) =>
        apiJson.post(URIS.STD_REGISTRATION, payload),
    addStdMulRegistrationApi: (payload) =>
        apiJson.post(URIS.BULK_UPLOAD_TRASPORT, payload),
    //Contact
    // getContactApi: (payload) => apiJson.get(URIS.GET_CONTACT_ALL, payload),
    // addContactApi: (payload) => apiJson.post(URIS.ADD_CONTACT, payload),
    // getContactBanksApi: (payload) => apiJson.get(URIS.GET_CONTACT_BANKS + "/" + payload,),
    // addBankApi: (payload) => apiJson.post(URIS.ADD_BANK, payload),
    // deleteBankApi: (payload) => apiJson.delete(URIS.DELETE_BANK + "/" + payload),
    // addUpiApi: (payload) => apiJson.post(URIS.ADD_UPI, payload),
    // deleteUpiApi: (payload) => apiJson.delete(URIS.DELETE_UPI + "/" + payload),

    // Mobile App
    getAlbumApi: (payload) => apiJson.post(URIS.ALBUM, payload),
    getByIdAlbumApi: (payload) => apiJson.get(URIS.ALBUM + "/" + payload.id),
    addAlbumApi: (payload) => apiMultipart.post(URIS.ADD_ALBUM, payload),
    addMobileTimetableApi: (payload) =>
        apiMultipart.post(URIS.TIME_TABLE + "/add", payload),
    getTimetableApi: (payload) => apiJson.post(URIS.TIME_TABLE, payload),

    getGrevienceApi: (payload) => apiJson.post(URIS.GREVIENCE, payload),
    updateGreviencApi: (payload) =>
        apiJson.put(URIS.GREVIENCE + "/" + payload.id, payload),

    updateAlbumApi: (payload) =>
        apiJson.put(URIS.ALBUM + "/" + payload.id, payload),

    updateAlbumApi: (payload) =>
        apiMultipart.put(URIS.TIME_TABLE + "/" + payload.id, payload),
    deleteTimeTableApi: (payload) =>
        apiJson.delete(URIS.TIME_TABLE + "/" + payload),
    deleteAlbumApi: (payload) => apiJson.delete(URIS.ALBUM + "/" + payload),
    getHolidayApi: (payload) => apiJson.post(URIS.HOLIDAY, payload),
    addHolidayApi: (payload) => apiJson.post(URIS.ADD_HOLIDAY, payload),
    updateHolidayApi: (payload) =>
        apiJson.put(URIS.HOLIDAY + "/" + payload.id, payload),
    deleteHolidayApi: (payload) => apiJson.delete(URIS.HOLIDAY + "/" + payload),
    getChapterApi: (payload) => apiJson.post(URIS.CHAPTER, payload),
    addChapterApi: (payload) => apiJson.post(URIS.ADD_CHAPTER, payload),
    addHomeWorkApi: (payload) =>
        apiMultipart.post(URIS.ADD_HOMEWORK + "/add", payload),

    updateHomeWorkApi: (payload) =>
        apiMultipart.put(URIS.ADD_HOMEWORK + "/" + payload.id, payload),

    getHomeWorkApi: (payload) => apiJson.post(URIS.ADD_HOMEWORK, payload),
    getSyllabusApi: (payload) => apiJson.post(URIS.SYLLABUS, payload),
    addSyllabusApi: (payload) =>
        apiMultipart.post(URIS.SYLLABUS + "/add", payload),

    updateSyllabusApi: (payload) =>
        apiMultipart.put(URIS.SYLLABUS + "/" + payload.id, payload),

    deleteSyllabusApi: (payload) => apiJson.delete(URIS.SYLLABUS + "/" + payload),
    deleteHomeWorkApi: (payload) =>
        apiJson.delete(URIS.ADD_HOMEWORK + "/" + payload),
    updateChapterApi: (payload) =>
        apiJson.put(URIS.CHAPTER + "/" + payload.id, payload),
    deleteChapterApi: (payload) => apiJson.delete(URIS.CHAPTER + "/" + payload),
    getAppActivationApi: (payload) => apiJson.post(URIS.APP_ACTIVATION, payload),
    addAppActivationApi: (payload) =>
        apiJson.post(URIS.ADD_APP_ACTIVATION, payload),
    updateAppActivationApi: (payload) =>
        apiJson.put(URIS.ADD_APP_ACTIVATION + "/" + payload.id, payload),
    deleteAppActivationApi: (payload) =>
        apiJson.delete(URIS.DELETE_APP_ACTIVATION + "/" + payload),
    getClassActivateStdApi: (payload) =>
        apiJson.post(URIS.CLASS_ACTIVATE_STD, payload),
    getActivateStdDashApi: (payload) =>
        apiJson.post(URIS.ACTIVATE_STD_DASH, payload),
    getActivateStdApi: (payload) => apiJson.post(URIS.ACTIVATE_STD, payload),
    addActivateStdApi: (payload) => apiJson.post(URIS.ADD_ACTIVATE_STD, payload),
    updateActivateStdApi: (payload) =>
        apiJson.put(URIS.ADD_ACTIVATE_STD + "/" + payload.id, payload),
    deleteActivateStdApi: (payload) =>
        apiJson.delete(URIS.DELETE_ACTIVATE_STD + "/" + payload),

    getNoticeBoardApi: (payload) => apiJson.post(URIS.NOTICE_BOARD, payload),
    getTeachNoticeBoardApi: (payload) =>
        apiJson.post(URIS.TEACH_NOTICE_BOARD, payload),
    addNoticeBoardApi: (payload) =>
        apiMultipart.post(URIS.ADD_NOTICE_BOARD, payload),
    putNoticeBoardApi: (payload) =>
        apiMultipart.put(URIS.EDIT_NOTICE_BOARD + "/" + payload ? .id, payload),
    updateNoticeBoardApi: (payload) =>
        apiJson.put(URIS.EDIT_NOTICE_BOARD + "/" + payload.id, payload),
    deleteNoticeBoardApi: (payload) =>
        apiJson.delete(URIS.NOTICE_BOARD_DELETE + "/" + payload),
    getMessageApi: (payload) => apiJson.post(URIS.MESSAGE, payload),
    getTeachMessageApi: (payload) => apiJson.post(URIS.TEACH_MESSAGE, payload),
    addMessageApi: (payload) => apiJson.post(URIS.ADD_MESSAGE + "/add", payload),
    putMessageApi: (payload) =>
        apiJson.put(URIS.ADD_MESSAGE + "/" + payload.id, payload),
    updateMessageApi: (payload) =>
        apiJson.put(URIS.EDIT_MESSAGE + "/" + payload.id, payload),
    deleteMessageApi: (payload) =>
        apiJson.delete(URIS.ADD_MESSAGE + "/" + payload),

    // Staff
    getStaffApi: (payload) => apiJson.post(URIS.STAFF, payload),
    getStaffSuperAdminApi: (payload) =>
        apiJson.post(URIS.STAFF_SUPER_ADMIN, payload),
    empRegistrationApi: (payload) => apiMultipart.post(URIS.ADD_STAFF, payload),
    addStaffApi: (payload) => apiJson.post(URIS.ADD_STAFF, payload),
    promoteStaffApi: (payload) => apiJson.post(URIS.PROMOTE_STAFF, payload),
    updateStaffApi: (payload) =>
        apiMultipart.put(URIS.STAFF + "/" + payload.id, payload),
    updateSuperAdminStaffApi: (payload) =>
        apiJson.put(URIS.STAFF_SUPER_ADMIN + "/" + payload.id, payload),

    deleteStaffApi: (payload) => apiJson.delete(URIS.STAFF + "/" + payload),
    deleteSuperAdminStaffApi: (payload) =>
        apiJson.delete(URIS.STAFF_SUPER_ADMIN + "/" + payload),
    getClassTeachApi: (payload) =>
        apiJson.get(URIS.CLASS_TEACH, { params: payload }),
    addClassTeachApi: (payload) => apiJson.post(URIS.ADD_CLASS_TEACH, payload),
    updateClassTeachApi: (payload) =>
        apiJson.put(URIS.CLASS_TEACH + "/" + payload.id, payload),
    deleteClassTeachApi: (payload) =>
        apiJson.delete(URIS.CLASS_TEACH + "/" + payload),

    getStaffDailyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_STAFF_DAY_WISE_ATTENDANCE, payload),
    getStaffDayAttendApi: (payload) =>
        apiJson.post(URIS.GET_STAFF_DAY_WISE, payload),
    addStaffDayAttendApi: (payload) =>
        apiJson.post(URIS.DAY_STAFF_WISE_ATTENDANCE, payload),
    getStaffMonthlyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_STAFF_MONTH_WISE_ATTENDANCE, payload),
    addStaffMonthlyAttendanceApi: (payload) =>
        apiJson.post(URIS.MONTH_STAFF_WISE_ATTENDANCE, payload),
    getStaffYearlyAttendanceApi: (payload) =>
        apiJson.post(URIS.GET_STAFF_YEAR_WISE_ATTENDANCE, payload),

    // Admin
    updateSchoolApi: (payload) => apiMultipart.post(URIS.UPDATE_SCHOOL, payload),
    getUserApi: (payload) => apiJson.get(URIS.USER, { params: payload }),
    addUserApi: (payload) => apiJson.post(URIS.ADD_USER, payload),
    addMessageTemplateApi: (payload) => apiJson.post(URIS.ADD_MESSAGE_TEMPLATE, payload),
    updateMessageTemplateApi: (payload) =>
        apiJson.put(URIS.UPDATE_MESSAGE_TEMPLATE + "/" + payload.id, payload),
    getMessageTemplateApi: () => apiJson.get(URIS.MESSAGE_TEMPLATE_LIST),
    deleteMessageTemplateAction: (payload) => apiJson.delete(URIS.DELETE_MESSAGE_TEMPLATE + "/" + payload),
    updateUserApi: (payload) =>
        apiJson.put(URIS.USER + "/" + payload.id, payload),
    deleteUserApi: (payload) => apiJson.delete(URIS.USER + "/" + payload),
    getRoleApi: (payload) => apiJson.get(URIS.ROLE, { params: payload }),
    addRoleApi: (payload) => apiJson.post(URIS.ADD_ROLE, payload),
    updateRoleApi: (payload) =>
        apiJson.put(URIS.ROLE + "/" + payload.id, payload),
    deleteRoleApi: (payload) => apiJson.delete(URIS.ROLE + "/" + payload),
    // super Admin
    getRoleSuperAdminApi: (payload) =>
        apiJson.get(URIS.SUPER_ADMIN_ROLE, { params: payload }),
    addRoleSuperAdminApi: (payload) =>
        apiJson.post(URIS.SUPER_ADMIN_ADD_ROLE, payload),
    updateRoleSuperAdminApi: (payload) =>
        apiJson.put(URIS.SUPER_ADMIN_ROLE + "/" + payload.id, payload),
    updateTeacherLeaveRequest: (payload) =>
        apiJson.put(URIS.UPDATE_TEACHER_LEAVE_REQUEST + "/" + payload.id, payload),
    deleteRoleSuperAdminApi: (payload) =>
        apiJson.delete(URIS.SUPER_ADMIN_ROLE + "/" + payload),

    getBioDeviceApi: (payload) =>
        apiJson.get(URIS.BIO_DEVICE, { params: payload }),

    gatTeacherLeaveApi: (payload) => apiJson.post(URIS.TEACHER_LEAVE, payload),

    addBioDeviceApi: (payload) => apiJson.post(URIS.ADD_BIO_DEVICE, payload),
    updateBioDeviceApi: (payload) =>
        apiJson.put(URIS.BIO_DEVICE + "/" + payload.id, payload),
    deleteBioDeviceApi: (payload) =>
        apiJson.delete(URIS.BIO_DEVICE + "/" + payload),
    getClassTeachApi: (payload) =>
        apiJson.get(URIS.CLASS_TEACH, { params: payload }),
    addClassTeachApi: (payload) => apiJson.post(URIS.ADD_CLASS_TEACH, payload),
    updateClassTeachApi: (payload) =>
        apiJson.put(URIS.CLASS_TEACH + "/" + payload.id, payload),
    deleteClassTeachApi: (payload) =>
        apiJson.delete(URIS.CLASS_TEACH + "/" + payload),
    getSubTeachApi: (payload) => apiJson.get(URIS.SUB_TEACH, { params: payload }),
    getSingleSubTeachApi: (payload) =>
        apiJson.get(URIS.SUB_TEACH + "/" + payload),
    addSubTeachApi: (payload) => apiJson.post(URIS.ADD_SUB_TEACH, payload),
    updateSubTeachApi: (payload) =>
        apiJson.put(URIS.SUB_TEACH + "/" + payload.id, payload),
    deleteSubTeachApi: (payload) =>
        apiJson.delete(URIS.SUB_TEACH + "/" + payload),

    // Library
    getBookTypeApi: (payload) => apiJson.get(URIS.BOOK_TYPE, { params: payload }),
    addBookTypeApi: (payload) => apiJson.post(URIS.ADD_BOOK_TYPE, payload),
    updateBookTypeApi: (payload) =>
        apiJson.put(URIS.BOOK_TYPE + "/" + payload.id, payload),
    deleteBookTypeApi: (payload) =>
        apiJson.delete(URIS.BOOK_TYPE + "/" + payload),
    getCatalogApi: (payload) => apiJson.post(URIS.CATALOG, payload),
    getCatalogLimitApi: (payload) => apiJson.get(URIS.CATALOG_DATA, payload),
    addCatalogApi: (payload) => apiMultipart.post(URIS.ADD_CATALOG, payload),
    updateCatalogApi: (payload) =>
        apiMultipart.put(URIS.CATALOG + "/" + payload.id, payload),
    deleteCatalogApi: (payload) => apiJson.delete(URIS.CATALOG + "/" + payload),
    bulkUploadCatalogApi: (payload) =>
        apiJson.post(URIS.BULK_UPLOAD_CATALOG, payload),
    getVendorApi: (payload) => apiJson.get(URIS.VENDOR, { params: payload }),
    addVendorApi: (payload) => apiJson.post(URIS.ADD_VENDOR, payload),
    updateVendorApi: (payload) =>
        apiJson.put(URIS.VENDOR + "/" + payload.id, payload),
    deleteVendorApi: (payload) => apiJson.delete(URIS.VENDOR + "/" + payload),
    getPurchaseEntryApi: (payload) => apiJson.post(URIS.PURCHASE_ENTRY, payload),
    addPurchaseEntryApi: (payload) =>
        apiJson.post(URIS.ADD_PURCHASE_ENTRY, payload),
    updatePurchaseEntryApi: (payload) =>
        apiJson.put(URIS.PURCHASE_ENTRY + "/" + payload.id, payload),
    deletePurchaseEntryApi: (payload) =>
        apiJson.delete(URIS.PURCHASE_ENTRY + "/" + payload),
    getShelfLocationApi: (payload) =>
        apiJson.get(URIS.SHELF_LOCATION, { params: payload }),
    addShelfLocationApi: (payload) =>
        apiJson.post(URIS.ADD_SHELF_LOCATION, payload),
    updateShelfLocationApi: (payload) =>
        apiJson.put(URIS.SHELF_LOCATION + "/" + payload.id, payload),
    deleteShelfLocationApi: (payload) =>
        apiJson.delete(URIS.SHELF_LOCATION + "/" + payload),
    getLatePenaltyApi: (payload) =>
        apiJson.get(URIS.LATE_PENALTY, { params: payload }),
    addLatePenaltyApi: (payload) => apiJson.post(URIS.ADD_LATE_PENALTY, payload),
    updateLatePenaltyApi: (payload) =>
        apiJson.put(URIS.LATE_PENALTY + "/" + payload.id, payload),
    deleteLatePenaltyApi: (payload) =>
        apiJson.delete(URIS.LATE_PENALTY + "/" + payload),
    getAccessionApi: (payload) => apiJson.post(URIS.ACCESSION, payload),
    getSearchAccessionApi: (payload) =>
        apiJson.post(URIS.ACCESSION_SEARCH, payload),
    addAccessionApi: (payload) => apiJson.post(URIS.ADD_ACCESSION, payload),
    getCatalogDataApi: (payload) =>
        apiJson.get(URIS.GET_CATALOG_DATA + "/" + payload),
    updateAccessionApi: (payload) =>
        apiJson.put(URIS.ACCESSION + "/" + payload.id, payload),
    deleteAccessionApi: (payload) =>
        apiJson.delete(URIS.ACCESSION + "/" + payload),
    getBookIssueApi: (payload) => apiJson.post(URIS.BOOK_ISSUE, payload),
    addBookIssueApi: (payload) => apiJson.post(URIS.ADD_BOOK_ISSUE, payload),
    updateBookIssueApi: (payload) =>
        apiJson.put(URIS.BOOK_ISSUE + "/" + payload.id, payload),
    getStdBookApi: (payload) => apiJson.post(URIS.STD_BOOK_ISSUE, payload),
    getBookReturnApi: (payload) => apiJson.post(URIS.BOOK_ISSUE, payload),
    addBookReturnApi: (payload) =>
        apiJson.put(URIS.BOOK_RETURN + "/" + payload.promotionId, payload),
    updateBookReturnApi: (payload) =>
        apiJson.put(URIS.BOOK_ISSUE + "/" + payload.id, payload),
    bookSubmitApi: (payload) =>
        apiJson.put(URIS.BOOK_RETURN + "/" + payload.id, payload),
    getCurrentStockApi: (payload) =>
        apiJson.get(URIS.CURRENT_STOCK, { params: payload }),
    getSearchBookApi: (payload) => apiJson.post(URIS.SEARCH_BOOK, payload),
    addPayGateWayApi: (payload) =>
        apiJson.put(URIS.PAYMENT_GATEWAY + "/" + payload.id, payload),
    addLibraryCardApi: (payload) =>
        apiJson.post(URIS.LIBRARY_CARD_ISSUE, payload),
    getStudentBirthdayApi: (payload) => apiJson.post(URIS.DOB_SEARCH, payload),
    getAgeWiseApi: (payload) => apiJson.post(URIS.AGE_FILTER, payload),
    getRteStudentpi: (payload) => apiJson.post(URIS.RTE_STUDENT, payload),
    getClassWiseAgeApi: (payload) => apiJson.post(URIS.CLASS_WISE_AGE, payload),

    // Account
    getVoucherNoApi: (payload) => apiJson.post(URIS.VOUCHER_NO, payload),
    getLedgerDetailApi: (payload) => apiJson.post(URIS.LEDGER_DETILS, payload),

    getExpenseTypeApi: (payload) =>
        apiJson.get(URIS.EXPENSE_TYPE, { params: payload }),
    addExpenseTypeApi: (payload) => apiJson.post(URIS.ADD_EXPENSE_TYPE, payload),
    updateExpenseTypeApi: (payload) =>
        apiJson.put(URIS.EXPENSE_TYPE + "/" + payload.id, payload),
    deleteExpenseTypeApi: (payload) =>
        apiJson.delete(URIS.EXPENSE_TYPE + "/" + payload),
    getIncomeTypeApi: (payload) =>
        apiJson.get(URIS.INCOME_TYPE, { params: payload }),
    addIncomeTypeApi: (payload) => apiJson.post(URIS.ADD_INCOME_TYPE, payload),
    updateIncomeTypeApi: (payload) =>
        apiJson.put(URIS.INCOME_TYPE + "/" + payload.id, payload),
    deleteIncomeTypeApi: (payload) =>
        apiJson.delete(URIS.INCOME_TYPE + "/" + payload),
    getLedgerApi: (payload) => apiJson.get(URIS.LEDGER, { params: payload }),
    addLedgerApi: (payload) => apiJson.post(URIS.ADD_LEDGER, payload),
    updateLedgerApi: (payload) =>
        apiJson.put(URIS.LEDGER + "/" + payload.id, payload),
    deleteLedgerApi: (payload) => apiJson.delete(URIS.LEDGER + "/" + payload),
    getPayableApi: (payload) => apiJson.post(URIS.PAYABLE, payload),
    addPayableApi: (payload) => apiJson.post(URIS.ADD_PAYABLE, payload),
    updatePayableApi: (payload) =>
        apiJson.put(URIS.PAYABLE + "/" + payload.id, payload),
    deletePayableApi: (payload) => apiJson.delete(URIS.PAYABLE + "/" + payload),
    getPayableReportApi: (payload) => apiJson.post(URIS.PAYABLE_REPORT, payload),
    getPaymentVoucherApi: (payload) =>
        apiJson.post(URIS.PAYMENT_VOUCHER, payload),
    addPaymentVoucherApi: (payload) =>
        apiJson.post(URIS.ADD_PAYMENT_VOUCHER, payload),
    updatePaymentVoucherApi: (payload) =>
        apiJson.put(URIS.PAYMENT_VOUCHER + "/" + payload.id, payload),
    deletePaymentVoucherApi: (payload) =>
        apiJson.delete(URIS.PAYMENT_VOUCHER + "/" + payload),
    getReceiptVoucherApi: (payload) =>
        apiJson.post(URIS.RECEIPT_VOUCHER, payload),
    addReceiptVoucherApi: (payload) =>
        apiJson.post(URIS.ADD_RECEIPT_VOUCHER, payload),
    updateReceiptVoucherApi: (payload) =>
        apiJson.put(URIS.RECEIPT_VOUCHER + "/" + payload.id, payload),
    deleteReceiptVoucherApi: (payload) =>
        apiJson.delete(URIS.RECEIPT_VOUCHER + "/" + payload),
    getExpenseDataApi: (payload) => apiJson.post(URIS.EXPENSE_REPORT, payload),
    getStatementApi: (payload) => apiJson.post(URIS.STATEMENT_REPORT, payload),
    getAccountBookApi: (payload) => apiJson.post(URIS.ACCOUNT_BOOK, payload),
    getCashBookApi: (payload) => apiJson.post(URIS.DAY_BOOK, payload),
    getContraVoucherApi: (payload) => apiJson.post(URIS.CONTRA_VOUCHER, payload),
    addContraVoucherApi: (payload) =>
        apiJson.post(URIS.ADD_CONTRA_VOUCHER, payload),
    updateContraVoucherApi: (payload) =>
        apiJson.put(URIS.CONTRA_VOUCHER + "/" + payload.id, payload),
    deleteContraVoucherApi: (payload) =>
        apiJson.delete(URIS.CONTRA_VOUCHER + "/" + payload),
    getGeneralVoucherApi: (payload) =>
        apiJson.post(URIS.GENERAL_VOUCHER, payload),
    addGeneralVoucherApi: (payload) =>
        apiJson.post(URIS.ADD_GENERAL_VOUCHER, payload),
    updateGeneralVoucherApi: (payload) =>
        apiJson.put(URIS.GENERAL_VOUCHER + "/" + payload.id, payload),
    deleteGeneralVoucherApi: (payload) =>
        apiJson.delete(URIS.GENERAL_VOUCHER + "/" + payload),

    // SMS
    getSmsSettingApi: (payload) =>
        apiJson.get(URIS.SMS_SETTING, { params: payload }),
    addSmsSettingApi: (payload) => apiJson.post(URIS.ADD_SMS_SETTING, payload),

    // shift
    getShiftApi: (payload) => apiJson.post(URIS.SHIFT, payload),
    getShiftOnlineApi: (payload) => apiJson.post(URIS.SHIFT_ONLINE, payload),

    getShiftByIdApi: (payload) =>
        apiJson.post(URIS.ROUTE + "/" + payload.transportRouteId, {
            sessionMasterId: payload.sessionMasterId,
        }),
    addShiftApi: (payload) => apiJson.post(URIS.ADD_SHIFT, payload),
    deleteShiftApi: (payload) => apiJson.delete(URIS.SHIFT + "/" + payload),
    putshiftApi: (payload) => apiJson.put(URIS.SHIFT + "/" + payload.id, payload),
    getMonthlyAttendaceApi: (payload) =>
        apiJson.post(URIS.MONTHLY_ATTENDANCE, payload),
    addTimeTableMastereApi: (payload) =>
        apiJson.post(URIS.ADD_TIMETABLE_MASTER, payload),
    getTimeTableMasterpi: (payload) =>
        apiJson.get(URIS.GET_TIMETABLE_MASTER, { params: payload }),
    updateimeTableMastereApi: (payload) =>
        apiJson.put(URIS.GET_TIMETABLE_MASTER + "/" + payload ? .id, payload),

    DeleteTimeTableMasterApi: (payload) =>
        apiJson.delete(URIS.GET_TIMETABLE_MASTER + "/" + payload),

    teacherRegistrationApi: (payload) =>
        apiMultipart.post(URIS.TEACHER_REGISTER + "/add", payload),
    getTeacherRegistrationrpi: (payload) =>
        apiJson.get(URIS.TEACHER_REGISTER, { params: payload }),
    updateTeacherRegistrationApi: (payload) =>
        apiJson.put(URIS.TEACHER_REGISTER + "/" + payload ? .id, payload),

    DetailAssignTimeTableAApi: (payload) =>
        apiJson.post(URIS.ASSIGN_TIMETABLE_DETAILS, payload),

    AddDetailAssignTimeTableAApi: (payload) =>
        apiJson.post(URIS.ASSIGN_TIMETABLE_DETAILS + "/add", payload),

    GetStudentTimeTableApi: (payload) =>
        apiJson.post(URIS.GET_STUDENT_TIMETABLE, payload),

    GetTeacherTimeTableApi: (payload) =>
        apiJson.post(URIS.TEACHER_TIMETABLE, payload),

    addAdjustmentTimetableApi: (payload) =>
        apiJson.post(URIS.ASSIGN_TIMETABLE_DETAILS + "/singleTeacher", payload),
    saveAdjustmentTimetableApi: (payload) =>
        apiJson.post(URIS.SAVE_ADJUST_TIMETABLE, payload),
    getTimeTableAdjustmentListApi: (payload) =>
        apiJson.post(URIS.GET_TIMETABLEADJUSTMENT_LIST, payload),

    getMarksheetDataApi: (payload) =>
        apiJson.post(URIS.GET_MARKSHEET_DATA, payload),

    getActivateTecApi: (payload) => apiJson.get(URIS.GET_TEACHER_LIST, payload),

    addActivateTecApi: (payload) => apiJson.post(URIS.ADD_ACTIVATE_TEC, payload),
    addDeactivateTecApi: (payload) =>
        apiJson.get(URIS.ADD_DEACTIVATE_TEC + payload),
    DeactivateTecApi: (payload) =>
        apiJson.delete(URIS.DEACTIVATE_TEC + "/" + payload),

    approveWebRequestApi: (payload) =>
        apiJson.post(URIS.APPROVE_WEB_REQUEST, payload),
    approveAppRequestApi: (payload) =>
        apiJson.put(URIS.APPROVE_APP_REQUEST + payload.id, payload),
    uploadImageApi: (payload) => apiMultipart.post(URIS.ADD_IMAGES, payload),

    makePaymentApi: (payload) =>
        apiJson.put(URIS.MAKE_PAYMENT + payload.orderId, payload),

    getBiometricApi: (payload) =>
        apiJson.post(URIS.GET_BIOMETRIC_DEVICES, payload),
    searchSchoolApi: (payload) => apiJson.post(URIS.SEARCH_SCHOOL, payload),

    addBiometricApi: (payload) =>
        apiJson.post(URIS.ADD_BIOMETRIC_DEVICE, payload),

    updateBiometricApi: (payload) =>
        apiJson.put(URIS.GET_BIOMETRIC_DEVICES + "/" + payload.id, payload),

    deleteBiometricApi: (payload) =>
        apiJson.delete(URIS.GET_BIOMETRIC_DEVICES + "/" + payload),
    acceptBulkRequestApi: (payload) =>
        apiJson.put(URIS.ACCEPT_BULK_MESSAGE + "/" + payload.list_id, payload),
    demandMorePackageRequest: (payload) =>
        apiJson.post(URIS.DEMAND_MORE_PACKAGE, payload),
    doRequestBulkMessageApi: () => apiJson.get(URIS.DO_REQUEST_BULK_MESSAGE),
    getRequestBulkMessageApi: (payload) =>
        apiJson.post(URIS.GET_REQUEST_BULK_MESSAGE, payload),

    getMoretBulkMessageApi: (payload) =>
        apiJson.post(URIS.GET_MORE_BULK_MESSAGE, payload),

    putMoretBulkMessageApi: (payload) =>
        apiJson.put(URIS.UPDATE_MORE_BULK_MESSAGE + "/" + payload.id, payload),

    empRegistrationSuperAdminApi: (payload) =>
        apiMultipart.post(URIS.STAFF_SUPER_ADMIN_ADD, payload),

    getdesignationSuperAdminApi: (payload) =>
        apiJson.get(URIS.DESIGNATION_SUPER_ADMIN, payload),
    adddesignationSuperAdminApi: (payload) =>
        apiJson.post(URIS.ADD_DESIGNATION_SUPER_ADMIN, payload),
    deletedesignationSuperAdminApi: (payload) =>
        apiJson.delete(URIS.DESIGNATION_SUPER_ADMIN + "/" + payload),
    putdesignationSuperAdminApi: (payload) =>
        apiJson.put(URIS.DESIGNATION_SUPER_ADMIN + "/" + payload.id, {
            name: payload.name,
        }),

    transportStopApi: (payload) => apiJson.post(URIS.TRASPORT_STOP, payload),

    // Public APIs
    getPublicStudentFeesApi: (payload) => apiJson.post(URIS.PUBLIC_STUDENT_FEES, payload),
};