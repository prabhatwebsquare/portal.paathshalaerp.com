import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { MODULES } from "@/constant/Modules";
import { useClientStore } from "@/store/client";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import { useEffect, useState } from "react";

export const ClientProfile = ({
  data,
  closeDrawer,
  themeColor,
  isForViewOnly,
}) => {
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleReject, setToggleReject] = useState(null);

  const { ApproveWebRequestAction, getClientRegAction } = useClientStore(
    (s) => ({
      ApproveWebRequestAction: s.ApproveWebRequestAction,
      getClientRegAction: s.getClientRegAction,
    })
  );

  const confirm = async () => {
    const info = {
      schoolCode: data?.schoolCode,
      status: 1,
    };

    await ApproveWebRequestAction(info);
    closeDrawer();
    getClientRegAction({
      page: 1,
      pageSize: 10,
      search: "",
      status: 0,
    });
  };

  const reject = () => {};

  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton color={"white"} size={"lg"} />
        <DrawerHeader
          bg={`${themeColor}.600`}
          color="white"
          textAlign="center"
          fontWeight="bold"
        >
          Profile
        </DrawerHeader>

        <DrawerBody>
          <Box bg="gray.100" borderRadius="lg" p={6} boxShadow="lg" mt={10}>
            {/* School/Institute Details */}
            <Box mb={6}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={`${themeColor}.600`}
                mb={2}
                borderBottom="2px solid"
                borderColor="teal.300"
              >
                School/Institute Details
              </Text>
              <Flex
                wrap="wrap"
                borderLeft="4px solid"
                borderColor="teal.500"
                pl={4}
                pt={2}
              >
                <ClientDetail
                  heading={"School/Institute"}
                  detail={data.schoolName}
                />
                <ClientDetail
                  heading={"Institute Contact"}
                  detail={data.contactNo}
                />
                <ClientDetail heading={"Registration No"} detail={data.regNo} />
                <ClientDetail heading={"Affiliation No"} detail={data.affNo} />
                <ClientDetail
                  heading={"Disc / School Code"}
                  detail={data.diseCode}
                />
                <ClientDetail
                  heading={"Telephone No."}
                  detail={data.telephoneNo}
                />
                <ClientDetail heading={"Email"} detail={data.schoolEmail} />
                <ClientDetail heading={"Address"} detail={data.address} />
                <ClientDetail heading={"District"} detail={data.district} />
                <ClientDetail heading={"State"} detail={data.state} />
                <ClientDetail heading={"Website"} detail={data.website} />
                <ClientDetail
                  heading={"Board/University"}
                  detail={data.board}
                />
                <ClientDetail
                  heading={"Expire Date"}
                  detail={
                    data?.expDate
                      ? dayjs(data?.expDate).format("YYYY-MM-DD")
                      : ""
                  }
                />
              </Flex>
            </Box>

            {/* Login Details */}
            <Box mb={6}>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color={`${themeColor}.600`}
                mb={2}
                borderBottom="2px solid"
                borderColor="blue.300"
              >
                Login Details
              </Text>
              <Flex
                wrap="wrap"
                borderLeft="4px solid"
                borderColor="blue.500"
                pl={4}
                pt={2}
              >
                <ClientDetail heading={"Name"} detail={data.name} />
                <ClientDetail heading={"Email"} detail={data.email} />
                <ClientDetail heading={"Mobile No"} detail={data.mobileNo} />
                <ClientDetail
                  heading={"School Code"}
                  detail={data.schoolCode}
                />
              </Flex>
            </Box>

            <Box>
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="purple.600"
                mb={2}
                borderBottom="2px solid"
                borderColor="purple.300"
              >
                Modules
              </Text>
              <Flex
                wrap="wrap"
                borderLeft="4px solid"
                borderColor="purple.500"
                pl={4}
                pt={2}
              >
                {map(MODULES, (m) => (
                  <Text
                    w="25%"
                    fontWeight="semibold"
                    color="purple.700"
                    mb={2}
                    p={2}
                    _hover={{
                      backgroundColor: "purple.50",
                      borderRadius: "md",
                      cursor: "pointer",
                    }}
                  >
                    {m.label}
                  </Text>
                ))}
              </Flex>
            </Box>
          </Box>
        </DrawerBody>

        {!isForViewOnly && (
          <DrawerFooter>
            <Button
              size={"sm"}
              colorScheme={themeColor}
              onClick={() => setToggleConfirm([])}
            >
              Approve
            </Button>
          </DrawerFooter>
        )}

        {toggleReject && (
          <ConfirmAlert
            heading={"Reject Confirmation"}
            description={"Are you sure? Do you want to reject client?"}
            closeAlert={() => setToggleReject(null)}
            button={"Reject"}
            color={"red"}
            confirm={reject} // Pass function reference
          />
        )}

        {toggleConfirm && (
          <ConfirmAlert
            heading={"Activate Confirmation"}
            description={"Are you sure? Do you want to activate client?"}
            closeAlert={() => setToggleConfirm(null)}
            button={"Activate"}
            color={themeColor}
            confirm={confirm} // Pass function reference, not an object
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

const ClientDetail = ({ heading, detail }) => {
  return (
    <Box w={"25%"} mb={2}>
      <Text fontSize={14}>{heading}</Text>
      <Text fontSize={16} fontWeight={"semibold"}>
        {detail || " - "}
      </Text>
    </Box>
  );
};
