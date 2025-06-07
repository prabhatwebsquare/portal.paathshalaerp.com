import { getLocalStorageItem } from "@/utils/LocalStorage";
import axios from "axios";
// export const FILE_URL = "https://developerapi.paathshalaerp.com/";
// export const MANULLAY_BASE_URL = "https://developerapi.paathshalaerp.com/api";
// const BASE_URL = "https://developerapi.paathshalaerp.com/api";
// export const URL = "https://developerapi.paathshalaerp.com/";
export const DIFFERENT_URL = "https://olddatatransfer.paathshalaerp.com/api/v1/";
const BASE_URL = "https://api.paathshalaerp.com/api";
export const URL = "https://api.paathshalaerp.com/";
export const FILE_URL = "https://api.paathshalaerp.com/";
export const MANULLAY_BASE_URL = "https://api.paathshalaerp.com/api";
export const URIS = {
    DEFAULT_SESSION: "/institute/session/defaultSession",
    LOGIN: "/institute/user/login",
    FIND_ME: "/institute/user/myRequest",

    FORGOT_PASSWORD: "/institute/user/forgotPassword",
    RESET_PASSWORD: "/institute/user/passwordReset",
    SYSADMIN_LOGIN: "/admin/user/login",
    GET_ADMIN_BANKS: "/admin/bank",
    ADD_ADMIN_BANKS: "/admin/bank/add",

    DASHBOARD: "/institute/dashboard",
    EXTRA_INFO_DASHBOARD: "/institute/dashboard/extraDashboard",

    CHANGE_PASS: "/institute/user/changePassword",
    UPDATE_NOW: "/institute/updateNow",

    CLIENT: "/admin/school",
    ADD_CLIENT: "/admin/school/add",
    APP_REQUEST: "/admin/mobileApp/requestApp",
    ORDER_REQUEST: "/admin/mobileApp/orderList",
    ADD_APP_REQUEST: "/admin/mobileApp/appOrder",

    APP_CLIENT: "/admin/mobileApp/getAppActiveList",
    ADD_APP_CLIENT: "/admin/mobileApp/appActive",
    SCHOOL_PERMISSION: "/admin/schoolPermission",
    ADD_SCHOOL_PERMISSION: "/admin/schoolPermission/add",
    GET_STATE: "/website/state",
    GET_DISTRICT: "/website/district",
    MONTHLY_ATTENDANCE: "/institute/attendance/month/register",
    //Institute SetUp
    CLASS_DETAILS: "institute/assignClass/newAssign",
    CLASS: "/institute/class",
    ADD_CLASS: "/institute/class/add",
    STREAM: "/institute/stream",
    STREAM_ONLINE: "/institute/onlineAdmission/stream",

    ADD_STREAM: "/institute/stream/add",
    SECTION: "/institute/section",
    SECTION_ONLINE: "/institute/onlineAdmission/section",

    ADD_SECTION: "/institute/section/add",

    ADD_HIGHLIGHT: "/institute/banner",

    SUBJECT: "/institute/subject",
    ADD_SUBJECT: "/institute/subject/add",
    CLASS_SUBJECT: "/institute/assignClass",
    CLASS_SUBJECT_ONLINE: "/institute/onlineAdmission/assignClass",

    ADD_CLASS_SUBJECT: "institute/assignClass/add",
    COLOR_CODE: "/institute/user/updateColor",

    FEES_NAME: "/institute/feesName",
    ADD_FEES_NAME: "/institute/feesName/add",
    FEES_GROUP: "/institute/feesGroup",
    ADD_FEES_GROUP: "/institute/feesGroup/add",
    UPDATE_FEES_GENERAL: "/institute/generalSetting/add",
    GET_GENERAL_SETTING: "/institute/generalSetting",
    ASSIGN_FEES: "/institute/assignFees",
    ASSIGN_FEES_ONLINE: "/institute/onlineAdmission/assignFees",

    ADD_ASSIGN_FEES: "/institute/assignFees/add",
    DISCOUNT_MASTER: "/institute/discountMaster",
    ADD_DISCOUNT_MASTER: "/institute/discountMaster/add",
    BROCHER_FEES: "/institute/admissionEnquiry/getUpdateBrocherFees",
    EDIT_BROCHER_FEES: "/institute/admissionEnquiry/updateBrocherFees",
    SESSION: "/institute/session",
    ADD_SESSION: "/institute/session/add",
    HOUSE: "/institute/house/",
    HOUSE_ONLINE: "/institute/onlineAdmission/house",
    ADD_HOUSE: "/institute/house/add",
    DESIGNATION: "/institute/designation",
    ADD_DESIGNATION: "/institute/designation/add",
    DESIGNATION_SUPER_ADMIN: "/admin/designation",
    ADD_DESIGNATION_SUPER_ADMIN: "/admin/designation/add",
    BANK: "/institute/bank",
    ADD_BANK: "/institute/bank/add",
    CLASS_DOCUMENT: "/institute/classDocument",
    ADD_CLASS_DOCUMENT: "/institute/classDocument/add",
    UPDATE_EXPIRY_DATE: "/admin/school/expDateUpdate/",
    GET_BIOMETRIC_DEVICES: "/admin/biometric",
    ADD_BIOMETRIC_DEVICE: "/admin/biometric/add",

    SEARCH_SCHOOL: "/admin/biometric/search",
    // shift
    SHIFT: "/institute/shift",
    SHIFT_ONLINE: "/institute/onlineAdmission/shift",

    ADD_SHIFT: "/institute/shift/add",
    RESTRICT_STUDENT: "/institute/student/statusUpdate",
    // Student
    ADD_ENQUIRY: "/institute/admissionEnquiry/add",
    GET_ENQUIRY: "/institute/admissionEnquiry",
    ONLINE_ADMISSION_LIST: "/institute/student/OnlineAdmissionRequest",
    ADD_STUDENT: "/institute/student/add",
    ADD_STUDENT_ONLINE: "/institute/onlineAdmission/student/add",
    SCHOOL_INFO: "institute/onlineAdmission/mySchool",

    ADD_PASS: "/institute/gatePass/add",
    GET_PASS: "/institute/gatePass",
    DELETE_PASS: "/institute/gatePass",

    EDIT_STUDENT: "/institute/student/update",
    GET_ALL_STUDENT: "/institute/student",
    DELETE_STUDENT: "/institute/student",
    DELETE_MULTI_STUDENT: "/institute/student/deleteStudent",

    HARD_DELETE_STUDENT: "/institute/student/hardDelete",
    UPLOAD_STUDENT_PIC: "/institute/student/uploadImage",
    CHECK_EXIST: "/institute/student/checkExit",
    BULK_ADMISSION: "/institute/student/bulkUpload",
    GET_CUSTOM_STUDENT: "/institute/student/custom",
    GET_CATEGORY_REPORT: "/institute/student/categoryList",
    GET_STUDENT_DETAILS: "/institute/student/getSingle",
    GET_FILTER_STUDENTS: "/institute/student/filterStudent",
    GET_SUBJECT_WISE: "/institute/student/subjectWiseFilter",
    ADD_FOLLOWUP: "/institute/admissionEnquiry/addFollow",
    GET_FOLLOWUP: "/institute/admissionEnquiry/followup",
    ADD_FEES_FOLLOWUP: "/institute/FeesFollowUp/add",
    GET_FEES_FOLLOWUP: "/institute/feesFollowup",
    GET_FEES_FOLLOWUP_DATEWISE: "/institute/FeesFollowUp/list",


    SEARCH_STUDENT: "/institute/student/search",
    STUDENT_FEES: "/institute/fees/getStudentFee",
    FEES_LEDGER: "/institute/fees/feesLedger",
    MAKE_STUDENT_FEES_RTE: "/institute/fees/rteApply",
    COLLECT_STUDENT_FEES: "/institute/fees/feesCollect",
    UPDATE_COLLECT_FEES: "/institute/fees/feesCollectUpdate",
    UPDATE_COLLECT_SINGLE_FEES: "/institute/fees/studentFeesUpdate",
    DELETE_COLLECT_SINGLE_FEES: "/institute/fees/studentFeesDelete",
    GET_FEES_RECEIPT: "/institute/fees/receiptReport",
    GET_OPEN_FEES_RECEIPT: "/institute/fees/receipt",
    GET_COLLECTIONS: "/institute/fees/feesCollectReport",
    ADD_COLLECT_FEES: "/institute/fees/studentFeesSave",
    CANCEL_FEES: "/institute/fees/feesCollectStatusUpdate",
    GET_PENDING_FEES: "/institute/fees/pendingSingleClassFees",
    GET_STUDENTLIST_CLASS: "/institute/student/classWishStudentList",
    STUDENT_PROMOTE_LIST: "/institute/promotion/get",
    STUDENT_PROMOTE: "/institute/promotion/now",
    GET_FEES_SUMMARY: "/institute/fees/feesSummary",
    GET_CLASS_SUMMARY: "/institute/student/classWish",

    GET_CHEQUE_List: "/institute/fees/chequeList",
    UPDATE_CHEQUE_STATUS: "/institute/fees/chequeStatus/add",
    GET_DISCOUNT: "/institute/fees/collectionDiscount",

    APPLY_DISCOUNT: "/institute/assignDiscount/add",
    GET_ASSIGN_DISCOUNT: "/institute/assignDiscount",
    UPDATE_ASSIGN_DISCOUNT: "/institute/assignDiscount",
    DELETE_STUDENT_FEES: "/institute/fees/deleteFees",

    ADD_SIBLING: "/institute/student/sibling/add",
    GET_ALL_SIBLINGS: "/institute/student/sibling",
    GET_SIBLINGS: "/institute/student/sibling",
    OPENING_STUDENT: "/institute/fees/openingAmount",
    ADD_OPENING_STUDENT: "/institute/fees/updateOpeningAmount",

    GET_DAY_WISE_ATTENDANCE: "/institute/attendance/dateReport",
    GET_DAY_WISE: "/institute/attendance/dayWise",
    DAY_WISE_ATTENDANCE: "/institute/attendance/dayWiseAdd",
    GET_STUD_MONTH_ATTE: "/institute/attendance/singleStudentMonthWiseAttendance",
    GET_STAFF_MONTH_ATTE: "/institute/staffAttendance/singleStaffMonthWiseAttendance",
    GET_MONTH_WISE_ATTENDANCE: "/institute/attendance/monthWise",
    MONTH_WISE_ATTENDANCE: "/institute/attendance/monthWiseAdd",
    STAFF_MONTH_WISE_ATTENDANCE: "/institute/staffAttendance/monthWiseAdd",
    GET_YEAR_WISE_ATTENDANCE: "/institute/attendance/yearWise",
    GET_BIO_ATTENDANCE: "/institute/attendance/biometricAttendance",
    GET_BIO_STAFF_ATTENDANCE: "/institute/staffAttendance/biometricAttendance",
    GET_SR_LIST: "/institute/srRegister",
    GET_STUDENT_SR: "/institute/srRegister",

    // Exams
    EXAM: "/institute/exam",
    ADD_EXAM: "/institute/exam/add",
    EXAM_GROUP: "/institute/examGroup",
    ADD_EXAM_GROUP: "/institute/examGroup/add",
    GET_ASSIGN_EXAM: "/institute/assignExam",
    ADD_ASSIGN_EXAM: "/institute/assignExam/add",

    // publishMarksheet
    ADD_PUBLISH_GROUP: "/institute/marksheetGroup/add",
    PUBLISH_GROUP: "/institute/marksheetGroup/",
    RESULT_STRUCTURE: "/institute/result",
    UPDATE_RESULT_STRUCTURE: "/institute/result/update",
    ASSIGN_ROLLNO: "/institute/exam/assignRollNo",
    ADD_EXAM_TIMETABLE: "/institute/examTimeTable/add",
    EXAM_TIMETABLE: "/institute/examTimeTable",
    GET_EXAM_MARKS: "/institute/studentExamMarks/add",
    EXAM_MARKS: "/institute/studentExamMarks",
    MARK_SHEET: "/institute/studentExamMarks/getMarkSheet",

    // Transport
    STATION: "/institute/station",
    SHIFT_BY_ID: "/institute/station/stationByShift",
    ADD_STATION: "/institute/station/add",
    ADD_FUEL: "/institute/vehicleFuel/add",
    FUEL: "/institute/vehicleFuel",
    DRIVER: "/institute/driver",
    ADD_DRIVER: "/institute/driver/add",
    TRANSPORTER: "/institute/transporter",
    ADD_TRANSPORTER: "/institute/transporter/add",
    VEHICLE: "/institute/vehicle",
    ADD_VEHICLE: "/institute/vehicle/add",
    ROUTE: "/institute/transportRoute",
    TRANSPORT_DASHBOARD: "/institute/dashboard/transport",
    ADD_ROUTE: "/institute/transportRoute/add",
    FEES_HEAD: "/institute/transportFee",
    ADD_FEES_HEAD: "/institute/transportFee/add",
    FEES_DEFINE: "/institute/assignTransportFee",
    ADD_FEES_DEFINE: "/institute/assignTransportFee/add",
    CHECK_FEES: "/institute/transportFee/checkFeesNow",
    STATION_FEES: "/institute/transportFee/transportStation",
    ROUTE_WISE_REPORT: "/institute/transportRoute/getStudentList",

    //Transport Fees
    GET_STD_REGISTRATION: "/institute/transportFee/getStudentTransportFees",
    GET_STD_NON_REGISTRATION: "/institute/transportFee/inactiveTransportStudent",

    STD_REGISTRATION: "/institute/transportFee/assignStudentTransportFees",
    BULK_UPLOAD_TRASPORT: "/institute/transportFee/assignStudentMultipleTransportFeesNow",

    //Contact
    // GET_CONTACT_ALL: "/admin/contact",
    // ADD_CONTACT: "/admin/contact/add",
    // GET_CONTACT_BANKS: "/admin/contact/allPaymentMode",
    // ADD_BANK: "/admin/bank/add",
    // DELETE_BANK: "/admin/bank",
    // ADD_UPI: "/admin/upi/add",
    // DELETE_UPI: "/admin/upi",

    // Mobile App
    ALBUM: "/institute/eventAlbum",
    ADD_ALBUM: "/institute/eventAlbum/add",
    TIME_TABLE: "/institute/timetable",
    GREVIENCE: "/institute/grievance",
    HOLIDAY: "/institute/holiday",
    ADD_HOLIDAY: "/institute/holiday/add",
    CHAPTER: "/institute/homeworkChapter",

    ADD_CHAPTER: "/institute/homeworkChapter/add",

    ADD_HOMEWORK: "/institute/homework",
    SYLLABUS: "/institute/syllabus",
    APP_ACTIVATION: "/institute/mobileApp/getAppRequest",
    ADD_APP_ACTIVATION: "/institute/mobileApp/appRequest",
    DELETE_APP_ACTIVATION: "/institute/app/user",
    CLASS_ACTIVATE_STD: "/institute/app/user/getAllStudent",
    ACTIVATE_STD_DASH: "/institute/app/user/studentDashboard",
    ACTIVATE_STD: "/institute/app/user/filterStudent",
    ADD_ACTIVATE_STD: "/institute/app/user/createStudent",
    GET_TEACHER_LIST: "/institute/app/user/teacher",
    DELETE_ACTIVATE_STD: "/institute/app/user",
    NOTICE_BOARD: "/institute/notice/student",
    NOTICE_BOARD_DELETE: "/institute/notice/",
    TEACH_NOTICE_BOARD: "/institute/notice/teacher",
    EDIT_NOTICE_BOARD: "/institute/notice",
    ADD_NOTICE_BOARD: "/institute/notice/add",
    MESSAGE: "/institute/message/student",
    TEACH_MESSAGE: "/institute/message/teacher",
    EDIT_MESSAGE: "/institute/message",
    ADD_MESSAGE: "/institute/message",
    // Staff
    STAFF: "/institute/staff",
    ADD_STAFF: "/institute/staff/add",
    PROMOTE_STAFF: "/institute/app/user/promote",
    CLASS_TEACH: "/institute/classTeacher",
    ADD_CLASS_TEACH: "/institute/classTeacher/add",
    SUB_TEACH: "/institute/subjectTeacher",
    ADD_SUB_TEACH: "/institute/subjectTeacher/add",
    GET_STAFF_DAY_WISE_ATTENDANCE: "/institute/staffAttendance/dayWise",
    GET_STAFF_DAY_WISE: "/institute/staffAttendance/dayWise",
    DAY_STAFF_WISE_ATTENDANCE: "/institute/staffAttendance/dayWiseAdd",
    GET_STAFF_MONTH_WISE_ATTENDANCE: "/institute/staffAttendance/monthWise",
    MONTH_STAFF_WISE_ATTENDANCE: "/institute/staffAttendance/monthWiseAdd",
    GET_STAFF_YEAR_WISE_ATTENDANCE: "/institute/staffAttendance/yearWise",

    //super admin
    STAFF_SUPER_ADMIN_ADD: "/admin/employee/add",
    STAFF_SUPER_ADMIN: "/admin/employee",
    ADD_STAFF_SUPER_ADMIN: "/institute/staff/add",
    // Admin
    UPDATE_SCHOOL: "/institute/user/updateSchool",
    USER: "/institute/user",
    ADD_USER: "/institute/user/add",
    ADD_MESSAGE_TEMPLATE: "/admin/messageTemplate/add",
    UPDATE_MESSAGE_TEMPLATE: "/admin/messageTemplate",
    MESSAGE_TEMPLATE_LIST: "/admin/messageTemplate",
    DELETE_MESSAGE_TEMPLATE: "/admin/messageTemplate",

    ROLE: "/institute/role",
    ADD_ROLE: "/institute/role/add",
    BIO_DEVICE: "/institute/bioDevice",
    ADD_BIO_DEVICE: "/institute/bioDevice/add",
    TEACHER_LEAVE: "/institute/leaveRequest",


    // super admin
    SUPER_ADMIN_ROLE: "/admin/role",
    SUPER_ADMIN_ADD_ROLE: "/admin/role/add",
    // Library
    BOOK_TYPE: "/institute/bookType",
    UPDATE_TEACHER_LEAVE_REQUEST: "/institute/leaveRequest",
    ADD_BOOK_TYPE: "/institute/bookType/add",
    CATALOG: "/institute/catelog",
    CATALOG_DATA: "/institute/catelog/cateLimit",
    ADD_CATALOG: "/institute/catelog/add",
    BULK_UPLOAD_CATALOG: "/institute/catelog/bulkUpload",
    VENDOR: "/institute/bookVendor",
    ADD_VENDOR: "/institute/bookVendor/add",
    PURCHASE_ENTRY: "/institute/purchaseBook",
    ADD_PURCHASE_ENTRY: "/institute/purchaseBook/add",
    SHELF_LOCATION: "/institute/shelfLocation",
    ADD_SHELF_LOCATION: "/institute/shelfLocation/add",
    LATE_PENALTY: "/institute/libraryPenalty",
    ADD_LATE_PENALTY: "/institute/libraryPenalty/add",
    ACCESSION_SEARCH: "/institute/accession/search",
    ACCESSION: "/institute/accession",
    ADD_ACCESSION: "/institute/accession/add",
    BOOK_ISSUE: "/institute/bookIssue",
    ADD_BOOK_ISSUE: "/institute/bookIssue/add",
    STD_BOOK_ISSUE: "/institute/bookIssue/studentBooks",
    BOOK_RETURN: "/institute/bookIssue/submit",
    GET_CATALOG_DATA: "/institute/accession/catelog",
    CURRENT_STOCK: "/institute/catelog/stock",
    SEARCH_BOOK: "/institute/catelog/search",
    PAYMENT_GATEWAY: "/admin/paymentGateway",
    LIBRARY_CARD_ISSUE: "/institute/student/libraryCardIssue",
    DOB_SEARCH: "/institute/student/dobSearch",
    AGE_FILTER: "/institute/student/ageFilter",
    CLASS_WISE_AGE: "/institute/student/classAgeFilter",
    RTE_STUDENT: "/institute/student/studentStatusList",
    // Account
    VOUCHER_NO: "/institute/accountReport/getVoucherNo",
    LEDGER_DETILS: "/institute/accountReport/currentStatement",
    EXPENSE_TYPE: "/institute/expenseType",
    ADD_EXPENSE_TYPE: "/institute/expenseType/add",
    INCOME_TYPE: "/institute/incomeType",
    ADD_INCOME_TYPE: "/institute/incomeType/add",
    LEDGER: "/institute/ledgerMaster",
    ADD_LEDGER: "/institute/ledgerMaster/add",
    PAYABLE: "/institute/payable",
    PAYABLE_REPORT: "/institute/payable/report",
    ADD_PAYABLE: "/institute/payable/add",
    PAYMENT_VOUCHER: "/institute/paymentVoucher",
    ADD_PAYMENT_VOUCHER: "/institute/paymentVoucher/add",
    RECEIPT_VOUCHER: "/institute/receiptVoucher",
    ADD_RECEIPT_VOUCHER: "/institute/receiptVoucher/add",
    EXPENSE_REPORT: "/institute/accountReport/expenseBook",
    STATEMENT_REPORT: "/institute/accountReport/statement",
    ACCOUNT_BOOK: "/institute/accountReport/book",
    DAY_BOOK: "/institute/accountReport/dayBook",
    CONTRA_VOUCHER: "/institute/contraVoucher",
    ADD_CONTRA_VOUCHER: "/institute/contraVoucher/add",
    GENERAL_VOUCHER: "/institute/generalVoucher",
    ADD_GENERAL_VOUCHER: "/institute/generalVoucher/add",

    // SMS
    SMS_SETTING: "/institute/smsSetting",
    ADD_SMS_SETTING: "/institute/smsSetting/add",
    // time Table
    ADD_TIMETABLE_MASTER: "/institute/periodTime/add",
    GET_TIMETABLE_MASTER: "institute/periodTime",

    // Teacher Registration

    TEACHER_REGISTER: "/institute/teacher",

    // Assign Time Table

    ASSIGN_TIMETABLE_DETAILS: "/institute/periodManagement",
    GET_STUDENT_TIMETABLE: "/institute/periodManagement/periodList",

    TEACHER_TIMETABLE: "/institute/periodManagement/teacher",
    SAVE_ADJUST_TIMETABLE: "/institute/adjustPeriod/add",
    GET_TIMETABLEADJUSTMENT_LIST: "/institute/adjustPeriod/newSingleTeacher",
    ADD_ACTIVATE_TEC: "/institute/app/user/add",
    ADD_DEACTIVATE_TEC: "/institute/app/user/deactivate/",
    DEACTIVATE_TEC: "/institute/app/user",

    GET_MARKSHEET_DATA: "/institute/studentExamMarks/marksheetData",

    APPROVE_WEB_REQUEST: "/admin/school/migration",

    APPROVE_APP_REQUEST: "admin/mobileApp/activeOrder/",
    MAKE_PAYMENT: "/admin/mobileApp/updateOrder/",
    ADD_IMAGES: "/institute/eventAlbum/images",

    DO_REQUEST_BULK_MESSAGE: "/institute/messageRequest",
    GET_REQUEST_BULK_MESSAGE: "/admin/messageRequest",
    ACCEPT_BULK_MESSAGE: "/admin/messageRequest",
    DEMAND_MORE_PACKAGE: "/institute/messageRequest/paymentRequest",
    GET_MORE_BULK_MESSAGE: "/admin/messageRequest/paymentList",
    UPDATE_MORE_BULK_MESSAGE: "/admin/messageRequest/payment",
    TRASPORT_STOP: "/institute/transportFee/transportStop",

};

export function createApiClient(contentType) {
    const accessToken = getLocalStorageItem("token");

    const headers = {
        "Cache-Control": "no-cache",
        "ngrok-skip-browser-warning": "69420",
    };

    if (contentType === "multipart") {
        headers["Content-Type"] = "multipart/form-data";
    } else if (contentType === "json") {
        headers["Content-Type"] = "application/json";
    }
    if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken;
    }

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers,
        timeout: 600000,
    });

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async(error) => {
            let originalRequest = error.config;
            let isUnauthorized = error.response && error.response.status === 401;
            if (isUnauthorized && !originalRequest._retry) {
                originalRequest._retry = true;
                localStorage.clear();
            }
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return axiosInstance;
}

const apiMultipart = createApiClient("multipart");
const apiJson = createApiClient("json");

export { apiMultipart, apiJson };