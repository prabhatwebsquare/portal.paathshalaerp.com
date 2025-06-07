import { LoadingContainer } from "@/common/LoadingContainer";
import { STATUS } from "@/constant";
import { useFeesSetupStore } from "@/store/feesSetup";
import {
  Checkbox,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { concat, filter, findIndex, map } from "lodash";
import { useEffect } from "react";
import { MdCurrencyRupee, MdPercent } from "react-icons/md";

export const StudentFees = ({
  admissionId,
  IsOnlineAdmission = false,
  classMasterId,
  streamMasterId,
  sessionMasterId,
  inputValue,
  setInputValue,
  themeColor,
  page,
}) => {
  const {
    getAssignFeesAction,
    getAssignFeesOnlineAction,
    getAssignFeesStatus,
    allAssignFees,
    resetAssignFeesStatus,
    resetGetAssignFees,
  } = useFeesSetupStore((s) => ({
    getAssignFeesAction: s.getAssignFeesAction,
    getAssignFeesOnlineAction: s.getAssignFeesOnlineAction,
    getAssignFeesStatus: s.getAssignFeesStatus,
    allAssignFees: s.allAssignFees,
    resetAssignFeesStatus: s.resetAssignFeesStatus,
    resetGetAssignFees: s.resetGetAssignFees,
  }));

  useEffect(() => {
    if ((getAssignFeesStatus || 1) === STATUS.NOT_STARTED) {
      if (IsOnlineAdmission) {
        getAssignFeesOnlineAction({
          orgCode: admissionId,
          sessionMasterId,
          classMasterId,
          streamMasterId,
        });
      } else {
        getAssignFeesAction({ sessionMasterId, classMasterId, streamMasterId });
      }
    }
  }, [
    classMasterId,
    getAssignFeesOnlineAction,
    getAssignFeesAction,
    getAssignFeesStatus,
    resetAssignFeesStatus,
    sessionMasterId,
    streamMasterId,
    IsOnlineAdmission,
    admissionId,
  ]);

  useEffect(() => {
    return () => resetGetAssignFees();
  }, [resetGetAssignFees]);

  const checkHandler = (val) => {
    if (findIndex(inputValue.selectedFees, (f) => f === val) !== -1) {
      setInputValue((pre) => ({
        ...pre,
        selectedFees: filter(inputValue.selectedFees, (f) => f !== val),
      }));
    } else {
      setInputValue((pre) => ({
        ...pre,
        selectedFees: concat(inputValue.selectedFees, val),
      }));
    }
  };

  const selectAll = () => {
    if (inputValue.selectedFees?.length === allAssignFees?.length) {
      setInputValue((pre) => ({ ...pre, selectedFees: [] }));
    } else {
      setInputValue((pre) => ({
        ...pre,
        selectedFees: map(allAssignFees, "id"),
      }));
    }
  };
  return (
    <LoadingContainer status={getAssignFeesStatus}>
      {!IsOnlineAdmission && 
       page != "promotion" && (
        <Checkbox
          textAlign={"end"}
          justifyContent={"flex-end"}
          display={"flex"}
          my={5}
          isChecked={inputValue.isRTE}
          fontWeight={"semibold"}
          colorScheme={themeColor}
          onChange={(e) =>
            setInputValue((pre) => ({
              ...pre,
              isRTE: Number(e.target.checked),
              selectedFees: 0,
            }))
          }
        >
          RTE Apply
        </Checkbox>
      )
      
      }
     

      <Table size={"sm"} mt={2}>
        <Thead>
          <Tr bg="gray.100">
            <Th>
              <Checkbox
                isDisabled={inputValue.isRTE}
                isChecked={
                  inputValue.selectedFees?.length === allAssignFees?.length
                    ? true
                    : false
                }
                colorScheme={themeColor}
                onChange={() => selectAll()}
              />
            </Th>
            <Th>Fees Name</Th>
            {/* <Th>Fees Group</Th> */}
            <Th>Amount</Th>
            <Th>Late Fees</Th>
            <Th>Due Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {map(allAssignFees, (fee) => {
            const checked =
              findIndex(inputValue.selectedFees, (f) => f === fee.id) !== -1
                ? true
                : false;
            return (
              <Tr>
                <Td>
                  <Checkbox
                    isDisabled={inputValue.isRTE}
                    isChecked={checked}
                    colorScheme={themeColor}
                    onChange={(e) => checkHandler(fee.id)}
                  />
                </Td>
                <Td>{fee.fees_name_master?.name}</Td>
                {/* <Td>{fee.fees_group_master?.name}</Td> */}
                <Td>{fee.feeAmount}</Td>
                <Td>
                  <Flex align={"center"} color={"red"}>
                    {fee.lateFees}
                    {fee.isPercent ? <MdPercent /> : <MdCurrencyRupee />} /{" "}
                    {fee.isDaily ? "Day" : "Month"}
                  </Flex>
                </Td>
                <Td>{dayjs(fee.dueDate).format("DD-MM-YYYY")}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </LoadingContainer>
  );
};
