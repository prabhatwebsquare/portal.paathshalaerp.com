import { RxDashboard } from "react-icons/rx";
import { IoHomeOutline } from "react-icons/io5";
import { MdCurrencyRupee } from "react-icons/md";
import { TbSettingsPlus } from "react-icons/tb";
import { BsGraphUp } from "react-icons/bs";
import { PERMISSIONS } from "./PermissionConstant";

export const MasterItems = [
  {
    name: "Home",
    icon: <IoHomeOutline />,
    key: "/",
    href: "/",
  },
  {
    name: "Class Setup",
    icon: <RxDashboard />,
    key: "class-setup",
    permission: PERMISSIONS.CLASS,
    href: "/school-setting/class-setup",
  },
  {
    name: "Fees Setup",
    icon: <MdCurrencyRupee />,
    key: "fees-setup",
    permission: PERMISSIONS.FEES_NAME,
    href: "/school-setting/fees-setup",
  },
  {
    name: "Additional Setting ",
    icon: <TbSettingsPlus />,
    key: "additional-setting",
    href: "/school-setting/additional-setting",
  },
  {
    name: "SMS Setting ",
    icon: <TbSettingsPlus />,
    key: "sms-setting",
    href: "/school-setting/sms-setting",
  },
];
