import CustomInput from "@/common/CustomInput";
import { CustomSelect } from "@/common/CustomSelect";
import { UploadFile } from "@/common/UploadFile";
import { STATUS } from "@/constant";
import { useLibraryStore } from "@/store/Library";
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
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { map } from "lodash";
import React, { useEffect, useState } from "react";

export const AddCatalog = ({ data, closeDrawer, themeColor }) => {
  const [inputFile, setInputFile] = useState({
    coverImage: data?.coverImage || "",
  });
  const [inputValue, setInputValue] = useState(
    data?.id
      ? {
          name: data.name,
          author: data.author,
          isbn: data.isbn,
          catelogType: data.catelogType,
          bookTypeId: data.bookTypeId,
          genre: data.genre,
          frequency: data.frequency,
          quantity: data.quantity,
          publisher: data.publisher,
          yearOfPublication: data.yearOfPublication,
          edition: data.edition,
          language: data.language,
          description: data.description,
          id: data.id,
        }
      : {}
  );

  const genres = [
    "Adventure",
    "Classics",
    "Contemporary Fiction",
    "Crime/Thriller",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Literary Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Young Adult (YA)",
    "Dystopian",
    "Magical Realism",
    "Graphic Novels/Comics",
    "Biography/Autobiography",
    "Memoir",
    "Self-Help/Personal Development",
    "History",
    "Science",
    "Philosophy",
    "Religion/Spirituality",
    "Travel",
    "True Crime",
    "Politics",
    "Business/Economics",
    "Health/Fitness",
    "Cookbooks/Food",
    "Art/Photography",
    "Education/Teaching",
    "Gardening/Home Improvement",
    "Parenting/Family",
    "Poetry",
    "Drama",
    "Humor/Comedy",
    "Short Stories",
    "Essays",
  ];

  const {
    addCatalogAction,
    addCatalogStatus,
    updateCatalogAction,
    updateCatalogStatus,
    resetCatalogStatus,
  } = useLibraryStore((s) => ({
    addCatalogAction: s.addCatalogAction,
    addCatalogStatus: s.addCatalogStatus,
    updateCatalogAction: s.updateCatalogAction,
    updateCatalogStatus: s.updateCatalogStatus,
    resetCatalogStatus: s.resetCatalogStatus,
  }));

  const { getBookTypeAction, getBookTypeStatus, allBookTypes } =
    useLibraryStore((s) => ({
      getBookTypeAction: s.getBookTypeAction,
      getBookTypeStatus: s.getBookTypeStatus,
      allBookTypes: s.allBookTypes,
    }));

  useEffect(() => {
    if ((getBookTypeStatus || 1) === STATUS.NOT_STARTED) {
      getBookTypeAction();
    }
  }, [getBookTypeAction, getBookTypeStatus]);

  const addCatalog = (e) => {
    e.preventDefault();
    if (data?.id) {
      updateCatalogAction({ ...inputValue, ...inputFile });
    } else {
      addCatalogAction({ ...inputValue, ...inputFile });
    }
  };

  useEffect(() => {
    if (
      addCatalogStatus === STATUS.SUCCESS ||
      updateCatalogStatus === STATUS.SUCCESS
    ) {
      resetCatalogStatus();
      closeDrawer();
    }
  }, [addCatalogStatus, closeDrawer, resetCatalogStatus, updateCatalogStatus]);

  return (
    <Drawer size={"lg"} isOpen={data} placement="right" onClose={closeDrawer}>
      <DrawerOverlay />
      <form onSubmit={addCatalog}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {data?.id ? "Edit Catalog" : "Add New Catalog"}
          </DrawerHeader>

          <DrawerBody>
            <Flex flexWrap={"wrap"} gap={3}>
              <CustomInput
                w={"48%"}
                type={"text"}
                name="name"
                label={"Book/Journal Name"}
                inputValue={inputValue}
                autoFocus={true}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"text"}
                name="author"
                label={"Author"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"text"}
                name="isbn"
                label={"ISBN"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomSelect
                w={"48%"}
                name="catelogType"
                label={"Select Catalog Type "}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={[
                  { value: "Book", name: "Book" },
                  { value: "Journal", name: "Journal" },
                ]}
              />
              <CustomSelect
                w={"48%"}
                name="bookTypeId"
                label={"Select Book/Journal Type "}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(allBookTypes, (type, i) => ({
                  name: type.name,
                  value: type.id,
                }))}
              />
              <CustomSelect
                w={"48%"}
                name="genre"
                label={"Select Genre "}
                inputValue={inputValue}
                setInputValue={setInputValue}
                data={map(genres, (genre) => ({ name: genre, value: genre }))}
              />
              {inputValue?.catelogType === "Journal" ? (
                <>
                  <CustomSelect
                    w={"48%"}
                    name="frequency"
                    label={"Select Frequency"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    data={[
                      { value: "Yearly", name: "Yearly" },
                      { value: "Half Yearly", name: "Half Yearly" },
                      { value: "Quarterly", name: "Quarterly" },
                      { value: "Monthly", name: "Monthly" },
                      { value: "Weekly", name: "Weekly" },
                      { value: "Daily", name: "Daily" },
                    ]}
                  />
                  <CustomInput
                    w={"48%"}
                    type={"number"}
                    name="quantity"
                    label={"Quantity"}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                  />
                </>
              ) : null}
              <CustomInput
                w={"48%"}
                type={"text"}
                name="publisher"
                label={"Publisher"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"number"}
                min="1900"
                max="2100"
                limit={4}
                name="yearOfPublication"
                label={"Year of Publication"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"text"}
                name="edition"
                label={"Edition"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"text"}
                name="language"
                label={"Language"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"number"}
                name="damageAmount"
                label={"Damage Amount"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"number"}
                name="lostAmount"
                label={"Lost Amount"}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              <CustomInput
                w={"48%"}
                type={"text"}
                name="description"
                label={"Description"}
                notRequire={true}
                inputValue={inputValue}
                setInputValue={setInputValue}
              />
              {/* <UploadFile
                                data={{ label: "Cover Image", name: "coverImage" }}
                                inputValue={inputFile}
                                setInputValue={setInputFile}
                            /> */}
            </Flex>
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
            <Button
              size={"sm"}
              type={"submit"}
              isLoading={
                addCatalogStatus === STATUS.FETCHING ||
                updateCatalogStatus === STATUS.FETCHING
              }
              colorScheme={themeColor}
            >
              {data?.id ? "Update" : "Add"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};
