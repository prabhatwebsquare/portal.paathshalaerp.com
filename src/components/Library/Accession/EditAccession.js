import { CustomSelect } from "@/common/CustomSelect";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { map } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdNotificationsActive, MdSettingsSuggest } from "react-icons/md";

export const EditAccession = ({
  data,
  closeModal,
  themeColor,
  closeDrawer,
}) => {
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          shelfLocationId: data.shelfLocationId,
          id: data.id,
        }
      : {}
  );
  const {
    getShelfLocationAction,
    getShelfLocationStatus,
    allShelfLocations,
    updateAccessionAction,
    updateAccessionStatus,
    resetAccessionStatus,
  } = useLibraryStore((s) => ({
    getShelfLocationAction: s.getShelfLocationAction,
    getShelfLocationStatus: s.getShelfLocationStatus,
    allShelfLocations: s.allShelfLocations,
    updateAccessionAction: s.updateAccessionAction,
    updateAccessionStatus: s.updateAccessionStatus,
    resetAccessionStatus: s.resetAccessionStatus,
  }));

  useEffect(() => {
    if ((getShelfLocationStatus || 1) === STATUS.NOT_STARTED) {
      getShelfLocationAction();
    }
  }, [getShelfLocationAction, getShelfLocationStatus]);

  const submit = () => {
    updateAccessionAction({
      id: data.id,
      shelfLocationId: inputValue.shelfLocationId,
    });
  };

  useEffect(() => {
    if (updateAccessionStatus === STATUS.SUCCESS) {
      resetAccessionStatus();
      closeDrawer();
    }
  }, [closeDrawer, resetAccessionStatus, updateAccessionStatus]);

  return (
    <Modal isOpen={data} onClose={closeModal} colorScheme={"blue"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Shelf</ModalHeader>
        <ModalCloseButton color={"white"} />
        <ModalBody>
          <Flex flexWrap={"wrap"} gap={5}>
            <CustomSelect
              name="shelfLocationId"
              label={"Select Shelf"}
              inputValue={inputValue}
              setInputValue={setInputValue}
              data={map(allShelfLocations, (s) => ({
                name: s.name,
                value: s.id,
              }))}
            />
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            variant={"outline"}
            colorScheme={"blue"}
            mr={3}
            onClick={closeDrawer}
          >
            Close
          </Button>
          <Button
            size="sm"
            colorScheme={themeColor}
            isLoading={updateAccessionStatus === STATUS.FETCHING}
            onClick={submit}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
