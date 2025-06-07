import { useState, useEffect } from "react";
import {
  Input,
  Box,
  VStack,
  Spinner,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { debounce } from "lodash";
import { useAdminBiometricStore } from "@/store/Biometric";

const SearchSchool = ({ setInputValue }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { searchSchoolAction, searchSchoolStatus, searchSchool , resetBiometricSearchStatus } =
    useAdminBiometricStore((s) => ({
      searchSchoolAction: s.searchSchoolAction,
      searchSchoolStatus: s.searchSchoolStatus,
      searchSchool: s.searchSchool,
      resetBiometricSearchStatus : s.resetBiometricSearchStatus
    }));
  // API Call Function
  const fetchSchools = async (query) => {
    if (!query) {
      return;
    }
    setLoading(true);
    await searchSchoolAction({
        search: query,
    })
    
    setLoading(false);
  };

  // Debounce API Call
  const handleSearch = debounce((query) => {
    fetchSchools(query);
  }, 500);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm]);

  const handleSelectSchool = (school) => {
    setInputValue((prev) => ({
      ...prev,
      schoolName: school.schoolName,
      schoolId: school.id,
      schoolCode: school.schoolCode,
    }));
    resetBiometricSearchStatus()
    setSearchTerm(""); // Reset search input
  };

  
  return (
    <Box width="100%">
      <Input
        placeholder="Search School"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <Spinner size="sm" mt={2} />}
      {searchSchool?.length > 0 && (
        <List
          border="1px solid gray"
          borderRadius="md"
          mt={2}
          maxH="200px"
          overflowY="auto"
          bg="white"
          position="absolute"
          width="90%"
          zIndex={2}
        >
          {searchSchool?.map((school) => (
            <ListItem
              key={school.id}
              p={2}
              cursor="pointer"
              _hover={{ bg: "gray.200" }}
              onClick={() => handleSelectSchool(school)}
            >
              {school.schoolName}
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default SearchSchool;
