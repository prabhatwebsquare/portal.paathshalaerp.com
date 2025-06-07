import { PageHeader } from "@/common/PageHeader";
import { TriangleUpIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DiscountRequest } from "./DiscountRequest";
import { CiDiscount1 } from "react-icons/ci";
import { FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { useStdFeesStore } from "@/store/stdFees";
import { SearchStudent } from "@/layout/SearchStudent";
import { DownloadExcel } from "@/common/DownloadExcel";
import { RiFileExcel2Fill } from "react-icons/ri";
import moment from "moment";

export const DisRequestDash = ({ themeColor, sessionMasterId }) => {
  const [selected, setSelected] = useState("all");
  const {
    getAssignDiscountAction,
    getAssignDiscountStatus,
    dashboardData,
    assignedDiscount,
  } = useStdFeesStore((s) => ({
    getAssignDiscountAction: s.getAssignDiscountAction,
    getAssignDiscountStatus: s.getAssignDiscountStatus,
    dashboardData: s.dashboardData,
    assignedDiscount: s.assignedDiscount,
  }));

  useEffect(() => {
    getAssignDiscountAction({
      sessionMasterId,
      status: "all",
    });
  }, [getAssignDiscountAction, sessionMasterId]);
  const [togalModal, setToggleModal] = useState(null);
  const [excelData, setExcelData] = useState(null);
  useEffect(() => {
    if (assignedDiscount?.length > 0) {
      const data = assignedDiscount.map((item) => ({
        srNo: item.student_master?.srNo || "-",
        name: item.student_master?.studentName || "-",
        fatherName: item.student_master?.fatherName || "-",
        contact: item.student_master?.fatherContact || "-",
        className: item.class_master?.name || "-",
        stream: item.stream_master?.name || "-",
        discount: item.discount || 0,
        remark: item.remarks || "-",
        requestedDate: item.createdAt ? moment(item.createdAt).format("MMMM DD, hh:mm A") : "-",
        approvedDate: item.updatedAt ? "-" : "-", // you can update logic if approvedDate is different
        approvedBy: item.approveBy || "-"
      }));
      setExcelData(data);
    }
  }, [assignedDiscount]);

  return (
    <Box>
      <PageHeader
        heading={"Discount Request"}
        extra={
          <DownloadExcel
            button={<RiFileExcel2Fill />}
            data={excelData}
            name={`Discount Request`}
          />
        }
      />
      <Box p={5} bg={"white"} h={"75vh"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Flex w={"100%"} justify={"space-between"}>
            <DashUi
              title={"Total Discount Req."}
              color={"blue"}
              icon={<CiDiscount1 fontWeight={"bold"} />}
              amount={dashboardData?.total || 0}
              // up={"14.5%"}
              val={"all"}
              setSelected={setSelected}
            />
            <DashUi
              title={"Total Approved"}
              color={"green"}
              icon={<FaRegCheckCircle fontSize={18} />}
              amount={dashboardData?.approved || 0}
              // up={"14.5%"}
              val={1}
              setSelected={setSelected}
            />
            <DashUi
              title={"Total Rejected"}
              color={"red"}
              icon={<RxCrossCircled fontSize={18} />}
              amount={dashboardData?.reject || 0}
              // up={"10.2%"}
              val={2}
              setSelected={setSelected}
            />
            <DashUi
              title={"Total Pending"}
              color={"yellow"}
              amount={dashboardData?.pending || 0}
              // up={"14.5%"}
              val={"0"}
              setSelected={setSelected}
            />
          </Flex>
          <DiscountRequest
            themeColor={themeColor}
            sessionMasterId={sessionMasterId}
            filter={selected}
          />
        </Box>
        <SearchStudent
          sessionMasterId={sessionMasterId}
          data={togalModal}
          closeModal={() => setToggleModal(null)}
          themeColor={themeColor}
        />
      </Box>
    </Box>
  );
};

const DashUi = ({ title, color, icon, amount, up, val, setSelected }) => {
  return (
    <Box
      p={3}
      w={"23%"}
      border={"1px solid"}
      borderColor={"gray.200"}
      borderRadius={8}
      bg={`${color}.600`}
      cursor={"pointer"}
      onClick={() => setSelected(val)}
    >
      <Text fontSize={13} color={"white"}>
        {title}
      </Text>
      <Flex mt={2} align={"center"} color={"white"}>
        {icon}
        <Text ml={2} fontSize={18}>
          {amount}
        </Text>
        {up && (
          <Flex ml={7} fontSize={11} align={"center"}>
            <TriangleUpIcon />
            <Text>{up}</Text>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};
