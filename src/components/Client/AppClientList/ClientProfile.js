import { ConfirmAlert } from "@/common/ConfirmationAlert";
import { MODULES } from "@/constant/Modules";
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
import { map } from "lodash";
import { useEffect, useState } from "react";

export const ClientProfile = ({ data, closeDrawer, themeColor }) => {
  const [toggleConfirm, setToggleConfirm] = useState(null);
  const [toggleReject, setToggleReject] = useState(null);

  const reject = () => {};
  const confirm = () => {};
  return (
    <Drawer size={"xl"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Profile</DrawerHeader>

        <DrawerBody>
          <Box>
            <Flex
              flexWrap={"wrap"}
              borderleft={"1px solid"}
              borderColor="gray.100"
            >
              <ClientDetail heading={"School/Institute"} detail={"IMPS"} />
              <ClientDetail
                heading={"Institute Contact"}
                detail={"9876543210"}
              />
              <ClientDetail heading={"Registration No"} detail={"1562"} />
              <ClientDetail heading={"Affiliation No"} detail={"459841"} />
              <ClientDetail
                heading={"Disc / School Code"}
                detail={"arfsdfg984516"}
              />
              <ClientDetail
                heading={"Telephone No."}
                detail={"141- 65165116626"}
              />
              <ClientDetail heading={"Email"} detail={"imps@gmail.com"} />
              <ClientDetail heading={"Website"} detail={"www.google.com"} />
              <ClientDetail heading={"Board/University"} detail={"RBSE"} />
            </Flex>
            <Text
              w={"fit-content"}
              mt={5}
              mb={2}
              fontWeight={"semibold"}
              borderBottom={"2px solid"}
              borderColor={"gray.500"}
            >
              Login Details
            </Text>
            <Flex
              flexWrap={"wrap"}
              borderleft={"1px solid"}
              borderColor="gray.100"
            >
              <ClientDetail heading={"Name"} detail={"Abhishek"} />
              <ClientDetail heading={"Email"} detail={"abhishek@gmail.com"} />
              <ClientDetail heading={"Mobile No"} detail={"9873216540"} />
            </Flex>
            <Text
              w={"fit-content"}
              mt={5}
              mb={2}
              fontWeight={"semibold"}
              borderBottom={"2px solid"}
              borderColor={"gray.500"}
            >
              Modules
            </Text>
            <Flex
              flexWrap={"wrap"}
              borderleft={"1px solid"}
              borderColor="gray.100"
            >
              {map(MODULES, (m) => {
                return (
                  <Text w={"25%"} fontWeight={"semibold"}>
                    {m.label}
                  </Text>
                );
              })}
            </Flex>
          </Box>
        </DrawerBody>

        <DrawerFooter>
          <Button
            size={"sm"}
            variant="outline"
            mr={3}
            colorScheme={"red"}
            onClick={() => setToggleReject([])}
          >
            Reject{" "}
          </Button>
          <Button
            size={"sm"}
            colorScheme={themeColor}
            onClick={() => setToggleConfirm([])}
          >
            Approve
          </Button>
        </DrawerFooter>

        {toggleReject && (
          <ConfirmAlert
            heading={"Reject Confirmation"}
            description={"Are you sure? Do you want to reject client"}
            closeAlert={() => setToggleReject(null)}
            button={"Reject"}
            color={"red"}
            confirm={() => reject(toggleReject)}
            // status={status}
          />
        )}
        {toggleConfirm && (
          <ConfirmAlert
            heading={"Activate Confirmation"}
            description={"Are you sure? Do you want to activate client"}
            closeAlert={() => setToggleConfirm(null)}
            button={"Activate"}
            color={"green"}
            confirm={() => confirm(toggleConfirm)}
            // status={status}
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
