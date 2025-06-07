const { PERMISSIONS } = require("./PermissionConstant");
export const Permissions = [
  {
    label: "Master",
    value: PERMISSIONS.MASTER,
    children: [
      [{ label: "Select All", value: PERMISSIONS.MASTER_ALL }],
      [
        { label: "Class", value: PERMISSIONS.CLASS },
        { label: "Class Add", value: PERMISSIONS.CLASS_ADD },
        { label: "Class Edit", value: PERMISSIONS.CLASS_EDIT },
        { label: "Class Delete", value: PERMISSIONS.CLASS_DELETE },
      ],
      [
        { label: "Stream", value: PERMISSIONS.STREAM },
        { label: "Stream Add", value: PERMISSIONS.STREAM_ADD },
        { label: "Stream Edit", value: PERMISSIONS.STREAM_EDIT },
        { label: "Stream Delete", value: PERMISSIONS.STREAM_DELETE },
      ],
      [
        { label: "Section", value: PERMISSIONS.SECTION },
        { label: "Section Add", value: PERMISSIONS.SECTION_ADD },
        { label: "Section Edit", value: PERMISSIONS.SECTION_EDIT },
        { label: "Section Delete", value: PERMISSIONS.SECTION_DELETE },
      ],
      [
        { label: "Subject", value: PERMISSIONS.SUBJECT },
        { label: "Subject Add", value: PERMISSIONS.SUBJECT_ADD },
        { label: "Subject Edit", value: PERMISSIONS.SUBJECT_EDIT },
        { label: "Subject Delete", value: PERMISSIONS.SUBJECT_DELETE },
      ],
      [
        { label: "Class Subject", value: PERMISSIONS.CLASS_SUBJECT },
        { label: "Class Subject Add", value: PERMISSIONS.CLASS_SUBJECT_ADD },
        { label: "Class Subject Edit", value: PERMISSIONS.CLASS_SUBJECT_EDIT },
        {
          label: "Class Subject Delete",
          value: PERMISSIONS.CLASS_SUBJECT_DELETE,
        },
      ],
      [
        { label: "Fees Name", value: PERMISSIONS.FEES_NAME },
        { label: "Fees Name Add", value: PERMISSIONS.FEES_NAME_ADD },
        { label: "Fees Name Edit", value: PERMISSIONS.FEES_NAME_EDIT },
        { label: "Fees Name Delete", value: PERMISSIONS.FEES_NAME_DELETE },
      ],
      [
        { label: "Discount Head", value: PERMISSIONS.DISCOUNT_HEAD },
        { label: "Discount Head Add", value: PERMISSIONS.DISCOUNT_HEAD_ADD },
        { label: "Discount Head Edit", value: PERMISSIONS.DISCOUNT_HEAD_EDIT },
        {
          label: "Discount Head Delete",
          value: PERMISSIONS.DISCOUNT_HEAD_DELETE,
        },
      ],
      [
        { label: "Assign Fees", value: PERMISSIONS.ASSIGN_FEES },
        { label: "Assign Fees Add", value: PERMISSIONS.ASSIGN_FEES_ADD },
        { label: "Assign Fees Edit", value: PERMISSIONS.ASSIGN_FEES_EDIT },
        { label: "Assign Fees Delete", value: PERMISSIONS.ASSIGN_FEES_DELETE },
      ],
      [
        { label: "Prospectus Fees", value: PERMISSIONS.PROSPECTUS_FEES },
        {
          label: "Prospectus Fees Edit",
          value: PERMISSIONS.PROSPECTUS_FEES_EDIT,
        },
      ],
      [
        { label: "Session", value: PERMISSIONS.SESSION },
        { label: "Session Add", value: PERMISSIONS.SESSION_ADD },
        { label: "Session Edit", value: PERMISSIONS.SESSION_EDIT },
        { label: "Session Delete", value: PERMISSIONS.SESSION_DELETE },
      ],
      [
        { label: "House", value: PERMISSIONS.HOUSE },
        { label: "House Add", value: PERMISSIONS.HOUSE_ADD },
        { label: "House Edit", value: PERMISSIONS.HOUSE_EDIT },
        { label: "House Delete", value: PERMISSIONS.HOUSE_DELETE },
      ],
      [
        { label: "Organisation Bank", value: PERMISSIONS.ORGANISATION_BANK },
        {
          label: "Organisation Bank Add",
          value: PERMISSIONS.ORGANISATION_BANK_ADD,
        },
        {
          label: "Organisation Bank Edit",
          value: PERMISSIONS.ORGANISATION_BANK_EDIT,
        },
        {
          label: "Organisation Bank Delete",
          value: PERMISSIONS.ORGANISATION_BANK_DELETE,
        },
      ],
      [
        { label: "Shift Management", value: PERMISSIONS.SHIFT_MANAGEMENT },
        {
          label: "Shift Management Add",
          value: PERMISSIONS.SHIFT_MANAGEMENT_ADD,
        },
        {
          label: "Shift Management Edit",
          value: PERMISSIONS.SHIFT_MANAGEMENT_EDIT,
        },
        {
          label: "Shift Management Delete",
          value: PERMISSIONS.SHIFT_MANAGEMENT_DELETE,
        },
      ],
    ],
  },
  {
    label: "Reception",
    value: PERMISSIONS.RECEPTION,
    children: [
      [{ label: "Select All", value: PERMISSIONS.RECEPTION }],
      [
        { label: "Enquiry", value: PERMISSIONS.ENQUIRY },
        { label: "Enquiry Add", value: PERMISSIONS.ENQUIRY_ADD },
        { label: "Enquiry Edit", value: PERMISSIONS.ENQUIRY_EDIT },
        { label: "Enquiry Delete", value: PERMISSIONS.ENQUIRY_DELETE },
      ],
      [
        { label: "Enquiry List", value: PERMISSIONS.ENQUIRY_LIST },
        { label: "Enquiry List Add", value: PERMISSIONS.ENQUIRY_LIST_ADD },
        { label: "Enquiry List Edit", value: PERMISSIONS.ENQUIRY_LIST_EDIT },
        {
          label: "Enquiry List Delete",
          value: PERMISSIONS.ENQUIRY_LIST_DELETE,
        },
      ],
      [{ label: "Collection Report", value: PERMISSIONS.COLLECTION_REPORT }],
      [{ label: "Gate Pass", value: PERMISSIONS.GATE_PASS_HISTORY }],

    ],
  },
  {
    label: "Student",
    value: PERMISSIONS.STUDENT,
    children: [
      [{ label: "Select All", value: PERMISSIONS.STUDENT_ALL }],
      [{ label: "Student Admission", value: PERMISSIONS.STUDENT_ADMISSION }],
      [
        { label: "Student List", value: PERMISSIONS.STUDENT_LIST },
        { label: "Student List Add", value: PERMISSIONS.STUDENT_LIST_ADD },
        { label: "Student List Edit", value: PERMISSIONS.STUDENT_LIST_EDIT },
        {
          label: "Student List Delete",
          value: PERMISSIONS.STUDENT_LIST_DELETE,
        },
      ],
      [
        {
          label: "Subject Wise Student Report",
          value: PERMISSIONS.SUBJECT_WISE_REPORT,
        },
      ],
      [
        { label: "Attendance Entry", value: PERMISSIONS.ATTENDANCE_ENTRY },
        {
          label: "Attendance Entry Add",
          value: PERMISSIONS.ATTENDANCE_ENTRY_ADD,
        },
        {
          label: "Student Attendance Edit",
          value: PERMISSIONS.STUDENT_ATTENDANCE_EDIT,
        },
        {
          label: "Student Attendance Delete",
          value: PERMISSIONS.STUDENT_ATTENDANCE_DELETE,
        },
      ],
  
      [{ label: "Attendance Report", value: PERMISSIONS.ATTENDANCE_REPORT }],
      [{ label: "Id Card", value: PERMISSIONS.ID_CARD }],
      [{ label: "Download Documents", value: PERMISSIONS.DOWNLOAD_DOCUMENTS }],
      [{ label: "Custom Report", value: PERMISSIONS.CUSTOM_REPORT }],
      [{ label: "Category Report", value: PERMISSIONS.CATEGORY_REPORT }],
      
      [{ label: "Certificate", value: PERMISSIONS.CERTIFICATE }],
      [
        { label: "Manage SR", value: PERMISSIONS.MANAGE_SR },
        { label: "Manage SR Add", value: PERMISSIONS.MANAGE_SR_ADD },
        { label: "Manage SR Edit", value: PERMISSIONS.MANAGE_SR_EDIT },
        { label: "Manage SR Delete", value: PERMISSIONS.MANAGE_SR_DELETE },
      ],
      [{ label: "SR List", value: PERMISSIONS.SR_LIST }],
      [
        { label: "Promotion", value: PERMISSIONS.PROMOTION },
        { label: "Promotion Add", value: PERMISSIONS.PROMOTION_ADD },
        { label: "Promotion Edit", value: PERMISSIONS.PROMOTION_EDIT },
        { label: "Promotion Delete", value: PERMISSIONS.PROMOTION_DELETE },
      ],
      [
        { label: "Siblings", value: PERMISSIONS.SIBLINGS },
        { label: "Siblings Add", value: PERMISSIONS.SIBLINGS_ADD },
        { label: "Siblings Edit", value: PERMISSIONS.SIBLINGS_EDIT },
        { label: "Siblings Delete", value: PERMISSIONS.SIBLINGS_DELETE },
      ],
      [{ label: "Birth Day List", value: PERMISSIONS.BIRTH_DAY_LIST }],
      [{ label: "Age Wise Student", value: PERMISSIONS.AGE_WISE_STUDENT }],
      [{ label: "PTM Report", value: PERMISSIONS.PTM_REPORT }],
      [{ label: "PTM", value: PERMISSIONS.PTM }],
     
      [
        { label: "Rustication", value: PERMISSIONS.RUSTICATION },
        { label: "Rustication Add", value: PERMISSIONS.RUSTICATION_ADD },
        { label: "Rustication Edit", value: PERMISSIONS.RUSTICATION_EDIT },
        { label: "Rustication Delete", value: PERMISSIONS.RUSTICATION_DELETE },
      ],
      [
        { label: "Student TC", value: PERMISSIONS.STUDENT_TC },
        { label: "Student TC Add", value: PERMISSIONS.STUDENT_TC_ADD },
        { label: "Student TC Edit", value: PERMISSIONS.STUDENT_TC_EDIT },
        { label: "Student TC Delete", value: PERMISSIONS.STUDENT_TC_DELETE },
      ],
      [{ label: "RTE Student", value: PERMISSIONS.RTE_STUDENT }],

      [{ label: "Delete Fees", value: PERMISSIONS.DELETE_FEES }],
      [
        {
          label: "Deleted Student Records",
          value: PERMISSIONS.DELETED_STUDENT,
        },
      ],
    ],
  },
  {
    label: "Fees",
    value: PERMISSIONS.FEES,
    children: [
      [{ label: "Select All", value: PERMISSIONS.FEES_ALL }],
      [{ label: "Fees Collection", value: PERMISSIONS.FEES_COLLECTION }],
      [
        { label: "Fees List", value: PERMISSIONS.FEES_LIST },
        { label: "Fees List Add", value: PERMISSIONS.FEES_LIST_ADD },
        { label: "Fees List Edit", value: PERMISSIONS.FEES_LIST_EDIT },
        { label: "Fees List Delete", value: PERMISSIONS.FEES_LIST_DELETE },
      ],
      [
        {
          label: "User Wise Collection",
          value: PERMISSIONS.USER_WISE_COLLECTION,
        },
      ],
      [{ label: "Online Transaction", value: PERMISSIONS.ONLINE_TRANSACTION }],
      [{ label: "Pending Fees", value: PERMISSIONS.PENDING_FEES }],
      [
        { label: "Cheque Status", value: PERMISSIONS.CHEQUE_STATUS },
        { label: "Cheque Status Edit", value: PERMISSIONS.CHEQUE_STATUS_EDIT },
      ],
      [{ label: "Fees Summery", value: PERMISSIONS.FEES_SUMMERY }],
      [
        { label: "Discount Request", value: PERMISSIONS.DISCOUNT_REQUEST },
        {
          label: "Discount Request Edit",
          value: PERMISSIONS.DISCOUNT_REQUEST_EDIT,
        },
      ],
      [{ label: "Fees Ledger", value: PERMISSIONS.FEES_LEDGER }],
      [{ label: "Last Year Dues", value: PERMISSIONS.LAST_YEAR_DUES }],
      [
        {
          label: "Allow Fee Entry for Older Dates",
          value: PERMISSIONS.CAN_ADD_FEE_PREVIOUS_DATE,
        },
      ],
      [{ label: "Delete Fees", value: PERMISSIONS.DELETE_FEES }],
    ],
  },
  {
    label: "Exam",
    value: PERMISSIONS.EXAM,
    children: [
      [{ label: "Select All", value: PERMISSIONS.EXAM_ALL }],
      [
        { label: "Create Exam", value: PERMISSIONS.CREATE_EXAM },
        { label: "Create Exam Add", value: PERMISSIONS.CREATE_EXAM_ADD },
        { label: "Create Exam Edit", value: PERMISSIONS.CREATE_EXAM_EDIT },
        { label: "Create Exam Delete", value: PERMISSIONS.CREATE_EXAM_DELETE },
      ],
      [
        { label: "Assign Marks", value: PERMISSIONS.ASSIGN_EXAM },
        { label: "Assign Marks Add", value: PERMISSIONS.ASSIGN_EXAM_ADD },
        { label: "Assign Marks Edit", value: PERMISSIONS.ASSIGN_EXAM_EDIT },
        { label: "Assign Marks Delete", value: PERMISSIONS.ASSIGN_EXAM_DELETE },
      ],
      [
        { label: "Result Structure", value: PERMISSIONS.RESULT_STRUCTURE },
        {
          label: "Result Structure Add",
          value: PERMISSIONS.RESULT_STRUCTURE_ADD,
        },
        {
          label: "Result Structure Edit",
          value: PERMISSIONS.RESULT_STRUCTURE_EDIT,
        },
        {
          label: "Result Structure Delete",
          value: PERMISSIONS.RESULT_STRUCTURE_DELETE,
        },
      ],
      [
        { label: "Roll Number", value: PERMISSIONS.GENERATE_ROLLNO },
        {
          label: "Roll Number Add",
          value: PERMISSIONS.GENERATE_ROLLNO_ADD,
        },
        {
          label: "Roll Number Edit",
          value: PERMISSIONS.GENERATE_ROLLNO_EDIT,
        },
        {
          label: "Roll Number Delete",
          value: PERMISSIONS.GENERATE_ROLLNO_DELETE,
        },
      ],
      [
        { label: "Admit Card", value: PERMISSIONS.ADMIT_CARD },
        { label: "Admit Card Add", value: PERMISSIONS.ADMIT_CARD_ADD },
        { label: "Admit Card Edit", value: PERMISSIONS.ADMIT_CARD_EDIT },
        { label: "Admit Card Delete", value: PERMISSIONS.ADMIT_CARD_DELETE },
      ],
      [
        { label: "Marks Entry", value: PERMISSIONS.MARKS_ENTRY },
        { label: "Marks Entry Add", value: PERMISSIONS.MARKS_ENTRY_ADD },
        { label: "Marks Entry Edit", value: PERMISSIONS.MARKS_ENTRY_EDIT },
        { label: "Marks Entry Delete", value: PERMISSIONS.MARKS_ENTRY_DELETE },
      ],
      [
        { label: "Rank Report", value: PERMISSIONS.RANK_REPORT },
        { label: "Rank Report Add", value: PERMISSIONS.RANK_REPORT_ADD },
        { label: "Rank Report Edit", value: PERMISSIONS.RANK_REPORT_EDIT },
        { label: "Rank Report Delete", value: PERMISSIONS.RANK_REPORT_DELETE },
      ],
      [
        { label: "Publish Marksheet", value: PERMISSIONS.PUBLISH_MARKSHEET },
        {
          label: "Publish Marksheet Add",
          value: PERMISSIONS.PUBLISH_MARKSHEET_ADD,
        },
        {
          label: "Publish Marksheet Edit",
          value: PERMISSIONS.PUBLISH_MARKSHEET_EDIT,
        },
        {
          label: "Publish Marksheet Delete",
          value: PERMISSIONS.PUBLISH_MARKSHEET_DELETE,
        },
      ],
      [
        { label: "Marksheet", value: PERMISSIONS.MARKSHEET },
        { label: "Marksheet Add", value: PERMISSIONS.MARKSHEET_ADD },
        { label: "Marksheet Edit", value: PERMISSIONS.MARKSHEET_EDIT },
        { label: "Marksheet Delete", value: PERMISSIONS.MARKSHEET_DELETE },
      ],
    ],
  },
  {
    label: "Transport",
    value: PERMISSIONS.TRANSPORT,
    children: [
      [{ label: "Select All", value: PERMISSIONS.TRANSPORT_ALL }],
      [
        { label: "Station", value: PERMISSIONS.STATION },
        { label: "Station Add", value: PERMISSIONS.STATION_ADD },
        { label: "Station Edit", value: PERMISSIONS.STATION_EDIT },
        { label: "Station Delete", value: PERMISSIONS.STATION_DELETE },
      ],
      [
        { label: "Driver Reg", value: PERMISSIONS.DRIVER_REG },
        { label: "Driver Reg Add", value: PERMISSIONS.DRIVER_REG_ADD },
        { label: "Driver Reg Edit", value: PERMISSIONS.DRIVER_REG_EDIT },
        { label: "Driver Reg Delete", value: PERMISSIONS.DRIVER_REG_DELETE },
      ],
      [
        { label: "Vehicle Reg", value: PERMISSIONS.VEHICLE_REG },
        { label: "Vehicle Reg Add", value: PERMISSIONS.VEHICLE_REG_ADD },
        { label: "Vehicle Reg Edit", value: PERMISSIONS.VEHICLE_REG_EDIT },
        { label: "Vehicle Reg Delete", value: PERMISSIONS.VEHICLE_REG_DELETE },
      ],
      [
        { label: "Route", value: PERMISSIONS.ROUTE },
        { label: "Route Add", value: PERMISSIONS.ROUTE_ADD },
        { label: "Route Edit", value: PERMISSIONS.ROUTE_EDIT },
        { label: "Route Delete", value: PERMISSIONS.ROUTE_DELETE },
      ],
      [
        { label: "Fees Head", value: PERMISSIONS.TRANS_FEES_HEAD },
        { label: "Fees Head Add", value: PERMISSIONS.TRANS_FEES_HEAD_ADD },
        { label: "Fees Head Edit", value: PERMISSIONS.TRANS_FEES_HEAD_EDIT },
        {
          label: "Fees Head Delete",
          value: PERMISSIONS.TRANS_FEES_HEAD_DELETE,
        },
      ],
      [
        { label: "Fees Define", value: PERMISSIONS.TRANS_FEES_DEFINE },
        { label: "Fees Define Add", value: PERMISSIONS.TRANS_FEES_DEFINE_ADD },
        {
          label: "Fees Define Edit",
          value: PERMISSIONS.TRANS_FEES_DEFINE_EDIT,
        },
        {
          label: "Fees Define Delete",
          value: PERMISSIONS.TRANS_FEES_DEFINE_DELETE,
        },
      ],
      [
        { label: "Transport Student", value: PERMISSIONS.TRANSPORT_STUDENT },
        {
          label: "Transport Student Add",
          value: PERMISSIONS.TRANSPORT_STUDENT_ADD,
        },
        {
          label: "Transport Student Edit",
          value: PERMISSIONS.TRANSPORT_STUDENT_EDIT,
        },
        {
          label: "Transport Student Delete",
          value: PERMISSIONS.TRANSPORT_STUDENT_DELETE,
        },
      ],
      [
        { label: "Transporter Name", value: PERMISSIONS.TRANSPORTER_NAME },
        {
          label: "Transporter Name Add",
          value: PERMISSIONS.TRANSPORTER_NAME_ADD,
        },
        {
          label: "Transporter Name Edit",
          value: PERMISSIONS.TRANSPORTER_NAME_EDIT,
        },
        {
          label: "Transporter Name Delete",
          value: PERMISSIONS.TRANSPORTER_NAME_DELETE,
        },
      ],
      [{ label: "Fees Collection", value: PERMISSIONS.TRANS_FEES_COLLECTION }],
      [{ label: "Fees List", value: PERMISSIONS.TRANS_FEES_LIST }],
      [
        {
          label: "User Wise Collection",
          value: PERMISSIONS.TRANS_USER_WISE_COLLECTION,
        },
      ],
      [{ label: "Pending Fees", value: PERMISSIONS.TRANS_PENDING_FEES }],
      [
        { label: "Route wise Report", value: PERMISSIONS.ROUTE_WISE_REPORT },
        {
          label: "Route wise Report Add",
          value: PERMISSIONS.ROUTE_WISE_REPORT_ADD,
        },
        {
          label: "Route wise Report Edit",
          value: PERMISSIONS.ROUTE_WISE_REPORT_EDIT,
        },
        {
          label: "Route wise Report Delete",
          value: PERMISSIONS.ROUTE_WISE_REPORT_DELETE,
        },
      ],
      [
        { label: "Cheque Status", value: PERMISSIONS.TRANS_CHEQUE_STATUS },
        {
          label: "Cheque Status Edit",
          value: PERMISSIONS.TRANS_CHEQUE_STATUS_EDIT,
        },
      ],
      [{ label: "Fees Ledger", value: PERMISSIONS.TRANS_FEES_LEDGER }],
      [
        { label: "Fuel Issue", value: PERMISSIONS.FUEL_ISSUE },
        {
          label: "Fuel Issue Add",
          value: PERMISSIONS.FUEL_ISSUE_ADD,
        },
        {
          label: "Fuel Issue Edit",
          value: PERMISSIONS.FUEL_ISSUE_EDIT,
        },
        {
          label: "Fuel Issue Delete",
          value: PERMISSIONS.FUEL_ISSUE_DELETE,
        },
      ],
      [{ label: "Send Notification", value: PERMISSIONS.SEND_NOTIFICATION }],
    ],
  },
  {
    label: "Hostel",
    value: PERMISSIONS.HOSTEL,
    children: [
      [{ label: "Select All", value: PERMISSIONS.HOSTEL_ALL }],
      [
        { label: "Room", value: PERMISSIONS.ROOM },
        { label: "Room Add", value: PERMISSIONS.ROOM_ADD },
        { label: "Room Edit", value: PERMISSIONS.ROOM_EDIT },
        { label: "Room Delete", value: PERMISSIONS.ROOM_DELETE },
      ],
      [{ label: "Student Reg", value: PERMISSIONS.STUDENT_REGISTRATION }],
      [{ label: "Student List", value: PERMISSIONS.STUDENT_LIST_HOSTEL }],
      [{ label: "ID Card", value: PERMISSIONS.ID_CARD_HOSTEL }],
      [{ label: "Hostel Fees", value: PERMISSIONS.HOSTEL_FEES }],
      [{ label: "Attendance", value: PERMISSIONS.HOSTEL_ATTENDANCE }],
      [{ label: "Room Checkout", value: PERMISSIONS.ROOM_CHECKOUT }],
      [{ label: "Family Meet", value: PERMISSIONS.FAMILY_MEET }],
    ],
  },
  {
    label: "Accounts",
    value: PERMISSIONS.ACCOUNTS,
    children: [
      [{ label: "Select All", value: PERMISSIONS.ACCOUNTS_ALL }],

      [
        { label: "Ledger Creation", value: PERMISSIONS.LEDGER_MASTER },
        { label: "Ledger Creation Add", value: PERMISSIONS.LEDGER_MASTER_ADD },
        { label: "Ledger Creation Edit", value: PERMISSIONS.LEDGER_MASTER_EDIT },
        {
          label: "Ledger Creation Delete",
          value: PERMISSIONS.LEDGER_MASTER_DELETE,
        },
      ], 
      [
        { label: "Expense Type", value: PERMISSIONS.EXPENSE_TYPE },
        { label: "Expense Type Add", value: PERMISSIONS.EXPENSE_TYPE_ADD },
        { label: "Expense Type Edit", value: PERMISSIONS.EXPENSE_TYPE_EDIT },
        {
          label: "Expense Type Delete",
          value: PERMISSIONS.EXPENSE_TYPE_DELETE,
        },
      ],
      [
        { label: "Payment Voucher", value: PERMISSIONS.ADD_PAYABLE },
        { label: "Payment Voucher Add", value: PERMISSIONS.ADD_PAYABLE_ADD },
        { label: "Payment Voucher Edit", value: PERMISSIONS.ADD_PAYABLE_EDIT },
        { label: "Payment Voucher Delete", value: PERMISSIONS.ADD_PAYABLE_DELETE },
      ],

      [
        { label: "Income Type", value: PERMISSIONS.INCOME_TYPE },
        { label: "Income Type Add", value: PERMISSIONS.INCOME_TYPE_ADD },
        { label: "Income Type Edit", value: PERMISSIONS.INCOME_TYPE_EDIT },
        { label: "Income Type Delete", value: PERMISSIONS.INCOME_TYPE_DELETE },
      ],
      [{ label: "Statement", value: PERMISSIONS.STATEMENT }],
      [{ label: "Expense Report", value: PERMISSIONS.EXPENSE_REPORT }],
      [
        { label: "Bank Transaction", value: PERMISSIONS.CONTRA_VOUCHER },
        { label: "Bank Transaction Add", value: PERMISSIONS.CONTRA_VOUCHER_ADD },
        {
          label: "Bank Transaction Edit",
          value: PERMISSIONS.CONTRA_VOUCHER_EDIT,
        },
        {
          label: "Bank Transaction Delete",
          value: PERMISSIONS.CONTRA_VOUCHER_DELETE,
        },
      ],
      [{ label: "Account Book", value: PERMISSIONS.ACCOUNT_BOOKS }],
      [{ label: "Cash Book", value: PERMISSIONS.CASH_BOOK }],
      [
        { label: "General Voucher", value: PERMISSIONS.GENERAL_VOUCHER },
        { label: "General Voucher Add", value: PERMISSIONS.GENERAL_VOUCHER_ADD },
        { label: "General Voucher Edit", value: PERMISSIONS.GENERAL_VOUCHER_EDIT },
        { label: "General Voucher Delete", value: PERMISSIONS.GENERAL_VOUCHER_DELETE },
      ],
      [
        { label: "Receipt Voucher", value: PERMISSIONS.RECEIPT_VOUCHER },
        { label: "Receipt Voucher Add", value: PERMISSIONS.RECEIPT_VOUCHER_ADD },
        { label: "Receipt Voucher Edit", value: PERMISSIONS.RECEIPT_VOUCHER_EDIT },
        { label: "Receipt Voucher Delete", value: PERMISSIONS.RECEIPT_VOUCHER_DELETE },
      ],
    ],
  },
  {
    label: "Library",
    value: PERMISSIONS.LIBRARY,
    children: [
      [{ label: "Select All", value: PERMISSIONS.LIBRARY_ALL }],
      [
        { label: "Book Type", value: PERMISSIONS.BOOK_TYPE },
        { label: "Book Type Add", value: PERMISSIONS.BOOK_TYPE_ADD },
        { label: "Book Type Edit", value: PERMISSIONS.BOOK_TYPE_EDIT },
        { label: "Book Type Delete", value: PERMISSIONS.BOOK_TYPE_DELETE },
      ],
      [
        { label: "Catalog", value: PERMISSIONS.CATALOG },
        { label: "Catalog Add", value: PERMISSIONS.CATALOG_ADD },
        { label: "Catalog Edit", value: PERMISSIONS.CATALOG_EDIT },
        { label: "Catalog Delete", value: PERMISSIONS.CATALOG_DELETE },
      ],
      [
        { label: "Book Vendor", value: PERMISSIONS.BOOK_VENDOR },
        { label: "Book Vendor Add", value: PERMISSIONS.BOOK_VENDOR_ADD },
        { label: "Book Vendor Edit", value: PERMISSIONS.BOOK_VENDOR_EDIT },
        { label: "Book Vendor Delete", value: PERMISSIONS.BOOK_VENDOR_DELETE },
      ],
      [
        { label: "Stock Entry", value: PERMISSIONS.PURCHASE_ENTRY },
        { label: "Stock Entry Add", value: PERMISSIONS.PURCHASE_ENTRY_ADD },
        { label: "Stock Entry Edit", value: PERMISSIONS.PURCHASE_ENTRY_EDIT },
        {
          label: "Stock Entry Delete",
          value: PERMISSIONS.PURCHASE_ENTRY_DELETE,
        },
      ],
      [
        { label: "Shelf Location", value: PERMISSIONS.SHELF_LOCATION },
        { label: "Shelf Location Add", value: PERMISSIONS.SHELF_LOCATION_ADD },
        {
          label: "Shelf Location Edit",
          value: PERMISSIONS.SHELF_LOCATION_EDIT,
        },
        {
          label: "Shelf Location Delete",
          value: PERMISSIONS.SHELF_LOCATION_DELETE,
        },
      ],
      [
        { label: "Accession", value: PERMISSIONS.ACCESSION },
        { label: "Accession Add", value: PERMISSIONS.ACCESSION_ADD },
        { label: "Accession Edit", value: PERMISSIONS.ACCESSION_EDIT },
        { label: "Accession Delete", value: PERMISSIONS.ACCESSION_DELETE },
      ],
      [
        { label: "Book Issue", value: PERMISSIONS.BOOK_ISSUE },
        { label: "Book Issue Add", value: PERMISSIONS.BOOK_ISSUE_ADD },
        { label: "Book Issue Edit", value: PERMISSIONS.BOOK_ISSUE_EDIT },
        { label: "Book Issue Delete", value: PERMISSIONS.BOOK_ISSUE_DELETE },
      ],
      [
        { label: "Book Return", value: PERMISSIONS.BOOK_RETURN },
        { label: "Book Return Add", value: PERMISSIONS.BOOK_RETURN_ADD },
        { label: "Book Return Edit", value: PERMISSIONS.BOOK_RETURN_EDIT },
        { label: "Book Return Delete", value: PERMISSIONS.BOOK_RETURN_DELETE },
      ],
      [
        { label: "Current Stock", value: PERMISSIONS.CURRENT_STOCK },
        { label: "Current Stock Add", value: PERMISSIONS.CURRENT_STOCK_ADD },
        { label: "Current Stock Edit", value: PERMISSIONS.CURRENT_STOCK_EDIT },
        {
          label: "Current Stock Delete",
          value: PERMISSIONS.CURRENT_STOCK_DELETE,
        },
      ],
      [{ label: "Search Book", value: PERMISSIONS.SEARCH_BOOK }],
      [
        { label: "Library Card", value: PERMISSIONS.LIBRARY_CARD },
        { label: "Library Card Status", value: PERMISSIONS.LIBRARY_CARD_ADD },
      ],
      [
        { label: "Library Setting", value: PERMISSIONS.LIBRARY_SETTING },
        {
          label: "Library Setting Status",
          value: PERMISSIONS.LIBRARY_SETTING_ADD,
        },
      ],
    ],
  },
  {
    label: "Admin",
    value: PERMISSIONS.ADMIN,
    children: [
      [{ label: "Select All", value: PERMISSIONS.ADMIN_ALL }],
      [
        { label: "User List", value: PERMISSIONS.USER_LIST },
        { label: "User List Add", value: PERMISSIONS.USER_LIST_ADD },
        { label: "User List Edit", value: PERMISSIONS.USER_LIST_EDIT },
        { label: "User List Delete", value: PERMISSIONS.USER_LIST_DELETE },
      ],
      [
        { label: "Roles", value: PERMISSIONS.ROLES },
        { label: "Roles Add", value: PERMISSIONS.ROLES_ADD },
        { label: "Roles Edit", value: PERMISSIONS.ROLES_EDIT },
        { label: "Roles Delete", value: PERMISSIONS.ROLES_DELETE },
      ],
      [{ label: "Calendar", value: PERMISSIONS.CALENDER }],
      [{ label: "Holiday List", value: PERMISSIONS.HOLIDAYS }],

    ],
  },
  {
    label: "Staff",
    value: PERMISSIONS.STAFF_MAIN,
    children: [
      [{ label: "Select All", value: PERMISSIONS.STAFF_MAIN_ALL }],
      [
        { label: "Staff", value: PERMISSIONS.STAFF_LIST },
        { label: "Staff Add", value: PERMISSIONS.STAFF_ADD },
        { label: "Staff Edit", value: PERMISSIONS.STAFF_EDIT },
        { label: "Staff Delete", value: PERMISSIONS.STAFF_DELETE },
      ],
      [
        { label: "Payslip", value: PERMISSIONS.PAYSLIP },
        { label: "Payslip Add", value: PERMISSIONS.PAYSLIP_ADD },
        { label: "Payslip Edit", value: PERMISSIONS.PAYSLIP_EDIT },
        { label: "Payslip Delete", value: PERMISSIONS.PAYSLIP_DELETE },
      ],
      [
        { label: "Salary List", value: PERMISSIONS.SALARY_LIST },
        { label: "Salary List Add", value: PERMISSIONS.SALARY_LIST_ADD },
        { label: "Salary List Edit", value: PERMISSIONS.SALARY_LIST_EDIT },
        { label: "Salary List Delete", value: PERMISSIONS.SALARY_LIST_DELETE },
      ],

      [
        { label: "Staff Attendance", value: PERMISSIONS.STAFF_ATTENDANCE },
        {
          label: "Staff Attendance Add",
          value: PERMISSIONS.STAFF_ATTENDANCE_ADD,
        },
        {
          label: "Staff Attendance Edit",
          value: PERMISSIONS.STAFF_ATTENDANCE_EDIT,
        },
        {
          label: "Staff Attendance Delete",
          value: PERMISSIONS.STAFF_ATTENDANCE_DELETE,
        },
      ],
      [{ label: "Attendance Report", value: PERMISSIONS.STAFF_ATTENDANCE_REPORT }],
      
    ],
  },
  {
    label: "Stock",
    value: PERMISSIONS.STOCK,
    children: [
      [{ label: "Select All", value: PERMISSIONS.STOCK_ALL }],
      [{ label: "Supplier", value: PERMISSIONS.SUPPLIER }],
      [{ label: "Item Creation", value: PERMISSIONS.ITEM_CREATION }],
      [{ label: "Department", value: PERMISSIONS.DEPARTMENT }],
      [{ label: "Stock Entry", value: PERMISSIONS.STOCK_ENTRY }],
      [{ label: "Issue Item", value: PERMISSIONS.ISSUE_ITEM }],
      [{ label: "Damage Item", value: PERMISSIONS.DAMAGE_ITEM }],
      [{ label: "Stock Report", value: PERMISSIONS.STOCK_REPORT }],
      [{ label: "Purchase Order", value: PERMISSIONS.PURCHASE_ORDER }],
    ],
  },
  {
    label: "Sale",
    value: PERMISSIONS.SALE,
    children: [
      [{ label: "Select All", value: PERMISSIONS.SALE_ALL }],
      [{ label: "Supplier", value: PERMISSIONS.SUPPLIER }],
      [{ label: "Item Creation", value: PERMISSIONS.ITEM_CREATION }],
      [{ label: "Stock Entry", value: PERMISSIONS.STOCK_ENTRY }],
      [{ label: "Issue Item", value: PERMISSIONS.ISSUE_ITEM }],
      [{ label: "Received Item", value: PERMISSIONS.RECEIVED_ITEM }],
      [{ label: "Damage Item", value: PERMISSIONS.DAMAGE_ITEM }],
      [{ label: "Stock Report", value: PERMISSIONS.STOCK_REPORT }],
      [{ label: "Seller List", value: PERMISSIONS.SELLER_LIST }],
      [{ label: "Seller Stock", value: PERMISSIONS.SELLER_STOCK }],
      [{ label: "Purchase Order", value: PERMISSIONS.PURCHASE_ORDER }],
    ],
  },
  {
    label: "Time Table",
    value: PERMISSIONS.TIME_TABLE,
    children: [
      [{ label: "Select All", value: PERMISSIONS.TIME_TABLE }],
      [
        { label: "Period Master", value: PERMISSIONS.PERIOD_MASTER },
        { label: "Period Master Add", value: PERMISSIONS.PERIOD_MASTER_ADD },
        { label: "Period Master Edit", value: PERMISSIONS.PERIOD_MASTER_EDIT },
        {
          label: "Period Master Delete",
          value: PERMISSIONS.PERIOD_MASTER_DELETE,
        },
      ],
      [
        {
          label: "Teacher Registration",
          value: PERMISSIONS.TEACHER_REGISTRATION,
        },
        {
          label: "Teacher Registration Add",
          value: PERMISSIONS.TEACHER_REGISTRATION_ADD,
        },
        {
          label: "Teacher Registration Edit",
          value: PERMISSIONS.TEACHER_REGISTRATION_EDIT,
        },
        {
          label: "Teacher Registration Delete",
          value: PERMISSIONS.TEACHER_REGISTRATION_DELETE,
        },
      ],
      [
        { label: "Assign Period", value: PERMISSIONS.ASSIGN_PERIOD },
        { label: "Assign Period Add", value: PERMISSIONS.ASSIGN_PERIOD_ADD },
        { label: "Assign Period Edit", value: PERMISSIONS.ASSIGN_PERIOD_EDIT },
        {
          label: "Assign Period Delete",
          value: PERMISSIONS.ASSIGN_PERIOD_DELETE,
        },
      ],
      [
        { label: "Teacher Timetable", value: PERMISSIONS.TEACHER_TIME_TABLE },
        {
          label: "Teacher Timetable Add",
          value: PERMISSIONS.TEACHER_TIME_TABLE_ADD,
        },
        {
          label: "Teacher Timetable Edit",
          value: PERMISSIONS.TEACHER_TIME_TABLE_EDIT,
        },
        {
          label: "Teacher Timetable Delete",
          value: PERMISSIONS.TEACHER_TIME_TABLE_DELETE,
        },
      ],
      [
        { label: "Class Timetable", value: PERMISSIONS.CLASS_TIME_TABLE },
        {
          label: "Class Timetable Add",
          value: PERMISSIONS.CLASS_TIME_TABLE_ADD,
        },
        {
          label: "Class Timetable Edit",
          value: PERMISSIONS.CLASS_TIME_TABLE_EDIT,
        },
        {
          label: "Class Timetable Delete",
          value: PERMISSIONS.CLASS_TIME_TABLE_DELETE,
        },
      ],
      [
        { label: "Temporary Time Table", value: PERMISSIONS.TIME_TABLE_ADJUST },
        {
          label: "Temporary Time Table Add",
          value: PERMISSIONS.TIME_TABLE_ADJUST_ADD,
        },
        {
          label: "Temporary Time Table Edit",
          value: PERMISSIONS.TIME_TABLE_ADJUST_EDIT,
        },
        {
          label: "Temporary Time Table Delete",
          value: PERMISSIONS.TIME_TABLE_ADJUST_DELETE,
        },
      ],
    ],
  },
  {
    label: "Mobile App",
    value: PERMISSIONS.MOBILE_APP,
    children: [
      [{ label: "Select All", value: PERMISSIONS.ADMIN_ALL }],
      [{ label: "Syllabus", value: PERMISSIONS.SYLLABUS }],
      [
        { label: "School Album", value: PERMISSIONS.SCHOOL_ALBUM },
        { label: "School Album Add", value: PERMISSIONS.SCHOOL_ALBUM_ADD },
        { label: "School Album Edit", value: PERMISSIONS.SCHOOL_ALBUM_EDIT },
        {
          label: "School Album Delete",
          value: PERMISSIONS.SCHOOL_ALBUM_DELETE,
        },
      ],
       [
        { label: "Staff", value: PERMISSIONS.STAFF },
        { label: "Staff Add", value: PERMISSIONS.STAFF_ADD },
        { label: "Staff Edit", value: PERMISSIONS.STAFF_EDIT },
        { label: "Staff Delete", value: PERMISSIONS.STAFF_DELETE },
      ],
      [
        { label: "Class Teacher", value: PERMISSIONS.CLASS_TEACHER },
        { label: "Class Teacher Add", value: PERMISSIONS.CLASS_TEACHER_ADD },
        { label: "Class Teacher Edit", value: PERMISSIONS.CLASS_TEACHER_EDIT },
        {
          label: "Class Teacher Delete",
          value: PERMISSIONS.CLASS_TEACHER_DELETE,
        },
      ],
      [
        { label: "Subject Teacher", value: PERMISSIONS.SUBJECT_TEACHER },
        {
          label: "Subject Teacher Add",
          value: PERMISSIONS.SUBJECT_TEACHER_ADD,
        },
        {
          label: "Subject Teacher Edit",
          value: PERMISSIONS.SUBJECT_TEACHER_EDIT,
        },
        {
          label: "Subject Teacher Delete",
          value: PERMISSIONS.SUBJECT_TEACHER_DELETE,
        },
      ],
      [
        {
          label: "Teacher Leave Request",
          value: PERMISSIONS.TEACHER_LEAVE_REQUEST,
        },
      ],
      [
        { label: "App Activation", value: PERMISSIONS.APP_ACTIVATION },
        { label: "App Activation Add", value: PERMISSIONS.APP_ACTIVATION_ADD },
        {
          label: "App Activation Edit",
          value: PERMISSIONS.APP_ACTIVATION_EDIT,
        },
        {
          label: "App Activation Delete",
          value: PERMISSIONS.APP_ACTIVATION_DELETE,
        },
      ],
      [
        { label: "Activated Student", value: PERMISSIONS.ACTIVATED_STUDENT },
        {
          label: "Activated Student Add",
          value: PERMISSIONS.ACTIVATED_STUDENT_ADD,
        },
        {
          label: "Activated Student Edit",
          value: PERMISSIONS.ACTIVATED_STUDENT_EDIT,
        },
        {
          label: "Activated Student Delete",
          value: PERMISSIONS.ACTIVATED_STUDENT_DELETE,
        },
      ],
     [
        { label: "Chapter", value: PERMISSIONS.CHAPTER },
        { label: "Chapter Add", value: PERMISSIONS.CHAPTER_ADD },
        { label: "Chapter Edit", value: PERMISSIONS.CHAPTER_EDIT },
        { label: "Chapter Delete", value: PERMISSIONS.CHAPTER_DELETE },
      ],
     [
        { label: "Homework", value: PERMISSIONS.HOMEWORK },
        { label: "Homework Add", value: PERMISSIONS.HOMEWORK_ADD },
        { label: "Homework Edit", value: PERMISSIONS.HOMEWORK_EDIT },
        { label: "Homework Delete", value: PERMISSIONS.HOMEWORK_DELETE },
      ],
      [
        { label: "Calender", value: PERMISSIONS.CALENDER },
        { label: "Calender Add", value: PERMISSIONS.CALENDER_ADD },
        { label: "Calender Edit", value: PERMISSIONS.CALENDER_EDIT },
        { label: "Calender Delete", value: PERMISSIONS.CALENDER_DELETE },
      ],
      [
        { label: "Notice Board", value: PERMISSIONS.NOTICE_BOARD },
        { label: "Notice Board Add", value: PERMISSIONS.NOTICE_BOARD_ADD },
        { label: "Notice Board Edit", value: PERMISSIONS.NOTICE_BOARD_EDIT },
        {
          label: "Notice Board Delete",
          value: PERMISSIONS.NOTICE_BOARD_DELETE,
        },
      ],
      [{ label: "News Highlight", value: PERMISSIONS.NEWS_HIGHLIGHT }],
      [{ label: "News POPUP", value: PERMISSIONS.NEWS_POPUP }],
      [
        { label: "App Message", value: PERMISSIONS.APP_MESSAGE },
        { label: "App Message Add", value: PERMISSIONS.APP_MESSAGE_ADD },
        { label: "App Message Edit", value: PERMISSIONS.APP_MESSAGE_EDIT },
        { label: "App Message Delete", value: PERMISSIONS.APP_MESSAGE_DELETE },
      ],
      [{ label: "Time Table", value: PERMISSIONS.TIME_TABLE_MOBILE_APP }],
      [{ label: "Grevience List", value: PERMISSIONS.GREVINCE_LIST }],
    ],
  },
];




      // [
      //   { label: "Exam Group", value: PERMISSIONS.EXAM_GROUP },
      //   { label: "Exam Group Add", value: PERMISSIONS.EXAM_GROUP_ADD },
      //   { label: "Exam Group Edit", value: PERMISSIONS.EXAM_GROUP_EDIT },
      //   { label: "Exam Group Delete", value: PERMISSIONS.EXAM_GROUP_DELETE },
      // ],

// [{ label: "Payable Report", value: PERMISSIONS.PAYABLE_REPORT }],
// [
//   { label: "Payment Voucher", value: PERMISSIONS.PAYMENT_VOUCHER },
//   {
//     label: "Payment Voucher Add",
//     value: PERMISSIONS.PAYMENT_VOUCHER_ADD,
//   },
//   {
//     label: "Payment Voucher Edit",
//     value: PERMISSIONS.PAYMENT_VOUCHER_EDIT,
//   },
//   {
//     label: "Payment Voucher Delete",
//     value: PERMISSIONS.PAYMENT_VOUCHER_DELETE,
//   },
// ],
// [
//   { label: "Receipt Voucher", value: PERMISSIONS.RECEIPT_VOUCHER },
//   {
//     label: "Receipt Voucher Add",
//     value: PERMISSIONS.RECEIPT_VOUCHER_ADD,
//   },
//   {
//     label: "Receipt Voucher Edit",
//     value: PERMISSIONS.RECEIPT_VOUCHER_EDIT,
//   },
//   {
//     label: "Receipt Voucher Delete",
//     value: PERMISSIONS.RECEIPT_VOUCHER_DELETE,
//   },
// ],

// [{ label: "General Voucher", value: PERMISSIONS.GENERAL_VOUCHER }],