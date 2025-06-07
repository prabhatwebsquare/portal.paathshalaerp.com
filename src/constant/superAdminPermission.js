const { PERMISSIONS } = require("./PermissionConstant");
export const Permissions = [
  {
    label: "Staff",
    value: PERMISSIONS.RECEPTION,
    children: [
      [{ label: "Select All", value: PERMISSIONS.RECEPTION }],
      [
        { label: "Role", value: PERMISSIONS.ENQUIRY },
        { label: "Role Add", value: PERMISSIONS.ENQUIRY_ADD },
        { label: "Role Edit", value: PERMISSIONS.ENQUIRY_EDIT },
        { label: "Role Delete", value: PERMISSIONS.ENQUIRY_DELETE },
        { label: "Role Permission", value: PERMISSIONS.ENQUIRY_DELETE },
      ],
      [
        { label: "Designation List", value: PERMISSIONS.ENQUIRY_LIST },
        { label: "Designation  Add", value: PERMISSIONS.ENQUIRY_LIST_ADD },
        { label: "Designation Edit", value: PERMISSIONS.ENQUIRY_LIST_EDIT },
        {
          label: "Designation Delete",
          value: PERMISSIONS.ENQUIRY_LIST_DELETE,
        },
      ],
      [
        { label: "Staff List", value: PERMISSIONS.ENQUIRY_LIST },
        { label: "Staff  Add", value: PERMISSIONS.ENQUIRY_LIST_ADD },
        { label: "Staff Edit", value: PERMISSIONS.ENQUIRY_LIST_EDIT },
        {
          label: "Staff Delete",
          value: PERMISSIONS.ENQUIRY_LIST_DELETE,
        },
      ],
    ],
  },
  {
    label: "ERP Info",
    value: PERMISSIONS.RECEPTION,
    children: [
      [{ label: "Select All", value: PERMISSIONS.RECEPTION }],
      [
        { label: "Register Request", value: PERMISSIONS.ENQUIRY },
      ],
      [
        { label: "Designation List", value: PERMISSIONS.ENQUIRY_LIST },
        { label: "Designation  Add", value: PERMISSIONS.ENQUIRY_LIST_ADD },
        { label: "Designation Edit", value: PERMISSIONS.ENQUIRY_LIST_EDIT },
        {
          label: "Designation Delete",
          value: PERMISSIONS.ENQUIRY_LIST_DELETE,
        },
      ],
      [
        { label: "Staff List", value: PERMISSIONS.ENQUIRY_LIST },
        { label: "Staff  Add", value: PERMISSIONS.ENQUIRY_LIST_ADD },
        { label: "Staff Edit", value: PERMISSIONS.ENQUIRY_LIST_EDIT },
        {
          label: "Staff Delete",
          value: PERMISSIONS.ENQUIRY_LIST_DELETE,
        },
      ],
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
];
