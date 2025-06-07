import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import CustomInput from "@/common/CustomInput";
import CustomTextarea from "@/common/CustomTextarea";
import { STATUS } from "@/constant";
import { useStdFeesStore } from "@/store/stdFees";
import { useFeesSetupStore } from "@/store/feesSetup";
import { concat, filter, find, map, sumBy, uniqBy } from "lodash";
import { LoadingContainer } from "@/common/LoadingContainer";
import { MdCurrencyRupee } from "react-icons/md";
import { CustomSelect } from "@/common/CustomSelect";

export const ApplyDiscount = ({
  data,
  closeDrawer,
  themeColor,
  sessionMasterId,
}) => {
  const [inputValue, setInputValue] = useState({});
  const inputHandler = (name, val) => {
    setInputValue((pre) => ({ ...pre, [name]: val, amount: 0 }));
  };
  const { applyDiscountAction, applyDiscountStatus, resetDiscount } =
    useStdFeesStore((s) => ({
      applyDiscountAction: s.applyDiscountAction,
      applyDiscountStatus: s.applyDiscountStatus,
      resetDiscount: s.resetDiscount,
    }));

  const {
    getStudentFeesAction,
    getStudentFeesStatus,
    studentFees,
    resetStudentFee,
  } = useStdFeesStore((s) => ({
    getStudentFeesAction: s.getStudentFeesAction,
    getStudentFeesStatus: s.getStudentFeesStatus,
    studentFees: s.studentFees,
    resetStudentFee: s.resetStudentFee,
  }));

  const {
    getDiscountMasterAction,
    getDiscountMasterStatus,
    allDiscountMasters,
    resetGetDiscountMaster,
  } = useFeesSetupStore((s) => ({
    getDiscountMasterAction: s.getDiscountMasterAction,
    getDiscountMasterStatus: s.getDiscountMasterStatus,
    allDiscountMasters: s.allDiscountMasters,
    resetGetDiscountMaster: s.resetGetDiscountMaster,
  }));

  useEffect(() => {
    if ((getDiscountMasterStatus || 1) === STATUS.NOT_STARTED) {
      getDiscountMasterAction();
    }
  }, [getDiscountMasterAction, getDiscountMasterStatus]);

  useEffect(() => {
    return () => resetGetDiscountMaster();
  }, [resetGetDiscountMaster]);

  useEffect(() => {
    if ((getStudentFeesStatus || 1) === STATUS.NOT_STARTED) {
      getStudentFeesAction({
        promotionId: data.id,
        studentMasterId: data.student_master.id,
      });
    }
  }, [data, getStudentFeesAction, getStudentFeesStatus]);

  const studentFeesDetails = useMemo(() => {
    return map(
      filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 1),
      (f) => ({
        ...f,
        id: f.feesNameMasterId,
        totalFees: f.amount,
        amount:
          f.amount -
          (sumBy(f.fees_collects, "amount") +
            sumBy(f.fees_collects, "discount")),
        deposite: sumBy(f.fees_collects, "amount"),
        discount: sumBy(f.fees_collects, "discount"),
        lateFees: f.lateFees - sumBy(f.fees_collects, "lateFees"),
      })
    );
  }, [studentFees?.studentFees]);

  const transportFeesDetails = useMemo(() => {
    return map(
      filter(studentFees?.studentFees, (s) => s.fees_type_master?.id === 2),
      (f) => ({
        ...f,
        totalFees: f.amount,
        amount:
          f.amount -
          (sumBy(f.fees_collects, "amount") +
            sumBy(f.fees_collects, "discount")),
        deposite: sumBy(f.fees_collects, "amount"),
        discount: sumBy(f.fees_collects, "discount"),
        lateFees: f.lateFees - sumBy(f.fees_collects, "lateFees"),
      })
    );
  }, [studentFees?.studentFees]);

  const headFeesHandler = (name, val) => {
    const feesType =
      inputValue?.feesType === "transport-fees"
        ? transportFeesDetails
        : studentFeesDetails;
    const stdFees = find(
      feesType,
      (f) => f?.id === parseInt(inputValue.feesNameMasterId)
    );
    if (name === "amount" && val > stdFees.amount) {
      setInputValue((pre) => ({ ...pre, [name]: stdFees.amount }));
    } else {
      setInputValue((pre) => ({ ...pre, [name]: val }));
    }
  };

  const selectHeadHandler = (name, val) => {
    setInputValue((pre) => ({
      ...pre,
      [name]: val,
      amount: "",
      discount: "",
      lateFees: "",
    }));
  };

  const fees = useMemo(() => {
    return find(
      inputValue?.feesType === "transport-fees"
        ? transportFeesDetails
        : studentFeesDetails,
      (f) => f?.id === parseInt(inputValue.feesNameMasterId)
    );
  }, [
    inputValue.feesNameMasterId,
    inputValue?.feesType,
    studentFeesDetails,
    transportFeesDetails,
  ]);

  useEffect(() => {
    if (inputValue?.feesNameMasterId && inputValue?.discountMasterId && fees) {
      const data = find(
        allDiscountMasters,
        (dis) => dis.id === parseInt(inputValue.discountMasterId)
      );
      if (data) {
        const discountAmount =
          fees.totalFees * (parseInt(data?.dis_value) / 100);
        headFeesHandler("amount", discountAmount);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    allDiscountMasters,
    fees,
    inputValue.discountMasterId,
    inputValue?.feesNameMasterId,
  ]);
  const [feesNameMasterId, setFeesNameMasterId] = useState(0);
  const applyDiscount = (e) => {
    e.preventDefault();
    const temp = {
      sessionMasterId,
      classMasterId: data.classMasterId,
      streamMasterId: data.streamMasterId,
      classMasterId: data.classMasterId,
      feesNameMasterId: inputValue.feesNameMasterId,
      discount: inputValue.amount,
      remarks: inputValue.remark,
      promotionId: data.id,
      feesTypeMasterId: feesNameMasterId[0].feesTypeMasterId,
    };
    applyDiscountAction(temp);
  };
  useEffect(() => {
    setFeesNameMasterId(
      studentFeesDetails.filter(
        (data) => data.id == inputValue.feesNameMasterId
      )
    );
    return () => {};
  }, [inputValue.feesNameMasterId]);
  const onClose = () => {
    resetStudentFee();
    closeDrawer();
  };

  useEffect(() => {
    if (applyDiscountStatus === STATUS.SUCCESS) {
      resetDiscount();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyDiscountStatus, resetDiscount]);

  return (
    <Drawer size={"md"} isOpen={data} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <form onSubmit={applyDiscount}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Apply Discount</DrawerHeader>
          <DrawerBody overflowY={"scroll"} className="scrollBar">
            <LoadingContainer status={getStudentFeesStatus}>
              <VStack spacing={5}>
                <Select
                  w={"100%"}
                  size="md"
                  isRequired
                  fontSize={13}
                  fontWeight={"bold"}
                  color={"blue.800"}
                  focusBorderColor={`${themeColor}.400`}
                  placeholder="Select Fees"
                  value={inputValue?.feesType}
                  onChange={(e) => inputHandler("feesType", e.target.value)}
                >
                  <option value={"school-fees"}>School Fees</option>
                  {transportFeesDetails?.length ? (
                    <option value={"transport-fees"}>Transport Fees</option>
                  ) : null}
                </Select>
                <Select
                  w={"100%"}
                  size="md"
                  fontSize={13}
                  fontWeight={"bold"}
                  color={"blue.800"}
                  focusBorderColor={`${themeColor}.400`}
                  placeholder="Select Fees Head"
                  value={inputValue?.feesNameMasterId}
                  onChange={(e) =>
                    selectHeadHandler("feesNameMasterId", e.target.value)
                  }
                >
                  {inputValue?.feesType === "transport-fees"
                    ? map(transportFeesDetails, (fee) => (
                        <option value={fee.id}>
                          {" "}
                          {fee?.transport_fee_master?.name}
                        </option>
                      ))
                    : map(studentFeesDetails, (fee) => (
                        <option value={fee.id}>
                          {" "}
                          {fee?.fees_name_master?.name}
                        </option>
                      ))}
                </Select>
                <CustomSelect
                  size={"sm"}
                  name={"discountMasterId"}
                  label={"Select Discount Master"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  data={map(allDiscountMasters, (d, key) => ({
                    value: d?.id,
                    name: d?.name,
                    discount: d?.dis_value,
                  }))}
                />
                {inputValue?.feesNameMasterId ? (
                  <Flex
                    w={"100%"}
                    align={"center"}
                    fontWeight={"bold"}
                    justify={"space-between"}
                  >
                    <Flex align={"center"}>
                      Total Fees: <MdCurrencyRupee />
                      {fees?.totalFees}
                    </Flex>
                    <Flex align={"center"} color={"red.500"}>
                      Due Fees: <MdCurrencyRupee />
                      {fees?.amount}
                    </Flex>
                  </Flex>
                ) : null}
                <CustomInput
                  w={"100%"}
                  type={"number"}
                  min={1}
                  name="amount"
                  label={"Discount"}
                  fees={true}
                  inputValue={inputValue}
                  setInputValue={headFeesHandler}
                />
                <CustomTextarea
                  w={"100%"}
                  notRequire={true}
                  type={"text"}
                  name="remark"
                  label={"Remark"}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                />
              </VStack>
            </LoadingContainer>
          </DrawerBody>
          <DrawerFooter>
            <Button
              size={"sm"}
              variant="outline"
              mr={3}
              colorScheme={"red"}
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button size={"sm"} colorScheme={themeColor} type="submit">
              Add
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
