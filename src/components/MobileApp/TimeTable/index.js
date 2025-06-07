import { PageHeader } from "@/common/PageHeader";
import { AddIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Image,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  Avatar,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DeleteButton } from "@/common/DeleteButton";
import { AddPopUpAlert } from "./AddTimeTable";
import { useMobileAppStore } from "@/store/MobileApp";
import { FILE_URL } from "@/services/apis";

export const PopUpAlert = ({ sessionMasterId, themeColor }) => {
  const {
    addTimetableAction,
    addTimetableStatus,
    updateTimetableAction,
    updateTimetabletatus,
    resetTimetableStatus,
    getTimetableAction,
    getTimetableStatus,
    allTimetable,
    deleteTimetableAction,
    deleteTimetableStatus,
  } = useMobileAppStore((s) => ({
    addTimetableAction: s.addTimetableAction,
    addTimetableStatus: s.addTimetableStatus,
    updateTimetableAction: s.updateTimetableAction,
    updateTimetabletatus: s.updateTimetabletatus,
    resetTimetableStatus: s.resetTimetableStatus,
    getTimetableAction: s.getTimetableAction,
    getTimetableStatus: s.getTimetableStatus,
    allTimetable: s.allTimetable,
    deleteTimetableAction: s.deleteTimetableAction,
    deleteTimetableStatus: s.deleteTimetableStatus,
  }));
  const [toggleDrawer, setToggleDrawer] = useState(null);
  const [dataList, setDataList] = useState([]);

  const deleteItem = (id) => {
    deleteTimetableAction(id);
  };

  useEffect(() => {
    getTimetableAction({ sessionMasterId });
    return () => {};
  }, []);

  const handleAddOrEdit = (data) => {
    const info = {
      sessionMasterId,
      ...data,
    };

    if (data?.id) {
      updateTimetableAction(info);
    } else {
      addTimetableAction(info);
    }
    setToggleDrawer(null);
  };
  return (
    <Box h="100%">
      <PageHeader
        heading={"Time Table"}
        extra={
          <Button
            size={"sm"}
            colorScheme={themeColor}
            leftIcon={<AddIcon />}
            onClick={() => setToggleDrawer({})} // Open empty form for adding a new item
          >
            Add Popup
          </Button>
        }
      />
      <Box p={5} bg={"white"} h={"90%"}>
        <Box className="scrollBar" maxH={"100%"} overflowY={"scroll"}>
          <Table>
            <Thead>
              <Tr>
                <Th>S No.</Th>
                <Th>Class</Th>
                <Th>Stream</Th>

                <Th>Title</Th>
                <Th>Description</Th>
                <Th>PDF</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allTimetable?.map((item, index) => (
                <Tr key={item.id}>
                  <Td>{index + 1}</Td>
                  <Td>{item.class_master.name}</Td>
                  <Td>{item.stream_master.name}</Td>

                  <Td>{item.title}</Td>
                  <Td
                    style={{
                      width: "40%",
                    }}
                  >
                    {item.description}
                  </Td>
                  <Td>
                    {item?.file ? (
                      <Flex justifyContent="center" w="full" mt={6}>
                        <Link
                          href={`${FILE_URL}${item?.file}`}
                          target="_blank"
                          textDecoration="none"
                          fontWeight="medium"
                        >
                          <Button
                            size="sm"
                            colorScheme={themeColor}
                            leftIcon={<DownloadIcon />}
                          >
                            Download PDF
                          </Button>
                        </Link>
                      </Flex>
                    ) : (
                      "N/A"
                    )}
                  </Td>
                  <Td>
                    <Tooltip placement="top" label="Edit">
                      <IconButton
                        size={"sm"}
                        variant={"ghost"}
                        icon={<EditIcon />}
                        colorScheme={"blue"}
                        onClick={() => setToggleDrawer(item)} // Open the form with the current item data
                      />
                    </Tooltip>
                    <DeleteButton
                      description={"Are you sure? Do you want to delete?"}
                      confirm={() => deleteItem(item.id)}
                      status={deleteTimetableStatus}
                      reset={resetTimetableStatus}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
      {toggleDrawer && (
        <AddPopUpAlert
          themeColor={themeColor}
          data={toggleDrawer}
          closeDrawer={() => setToggleDrawer(null)}
          handleAddOrEdit={handleAddOrEdit}
        />
      )}
    </Box>
  );
};
