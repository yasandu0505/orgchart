import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Button,
  Divider,
  Alert,
  AlertTitle,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import colors from "../assets/colors";
import utils from "../utils/utils";
import { ClipLoader } from "react-spinners";
import api from "././../services/services";
import { useSelector } from "react-redux";

const MinistryDrawerContent = ({
  selectedCard,
  selectedDate,
  onDepartmentClick,
}) => {
  if (!selectedCard) return null;

  const allPersonList = useSelector((state) => state.allPerson.allPerson);
  const allDepartmentList = useSelector(
    (state) => state.allDepartmentData.allDepartmentData
  );
  const { selectedMinistry } = useSelector((state) => state.allMinistryData);

  const [personListForMinistry, setPersonListForMinistry] = useState([]);
  const [departmentListForMinistry, setDepartmentListForMinistry] = useState(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("deparmtnelkjl");
    console.log(selectedMinistry);
    fetchPersonListAndDepListForMinistry(selectedMinistry);
  }, [selectedMinistry]);

  const clearCurrentLists = () => {
    setDepartmentListForMinistry([]);
    setPersonListForMinistry([]);
  };

  const fetchPersonListAndDepListForMinistry = async (selectedMinistry) => {
    try {
      setLoading(true);
      clearCurrentLists();
      const response1 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        selectedMinistry,
        "AS_APPOINTED"
      );
      const response2 = await api.fetchActiveRelationsForMinistry(
        selectedDate,
        selectedMinistry,
        "AS_DEPARTMENT"
      );

      const res1 = await response1.json();
      const res2 = await response2.json();

      const personSet = new Set(res1.map((person) => person.relatedEntityId));
      const departmentSet = new Set(
        res2.map((department) => department.relatedEntityId)
      );

      const personListInDetail = allPersonList.filter((person) => {
        return personSet.has(person.id);
      });

      const departmentListInDetail = allDepartmentList.filter((department) => {
        return departmentSet.has(department.id);
      });

      setPersonListForMinistry(personListInDetail);
      setDepartmentListForMinistry(departmentListInDetail);
      setLoading(false);
    } catch (e) {
      console.log(`Error fetching person list for mistry : `, e.message);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "none",
        mt: -5,
      }}
    >
      {/* Date */}
      <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 0.5 }}>
        Gazette Date
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
      >
        {selectedDate}
      </Typography>

      {/* Ministry Name */}
      <Box display="flex" alignItems="center" mb={2}>
        <ApartmentIcon
          color="primary"
          sx={{ mr: 1, color: colors.backgroundSecondary }}
        />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {selectedCard.name}
        </Typography>
      </Box>

      <Divider />

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20vh",
          }}
        >
          <ClipLoader
            color={"#000000"}
            loading={loading}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Box>
      ) : (
        <>
          {/* Ministers */}
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1, fontSize: "1.5rem", fontWeight: 600 }}
          >
            Ministers
          </Typography>

          {/* Ministers */}
          {/* <Stack spacing={1} mb={2}>
                {selectedCard.headMinister && (
                    <Box display="flex" alignItems="center">
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: colors.backgroundSecondary, minWidth: '20px' }} />
                        <Typography variant="body1">
                            <strong>Minister:</strong> {selectedCard.headMinister}
                        </Typography>
                    </Box>
                )}
                {selectedCard.deputyMinister && (
                    <Box display="flex" alignItems="center">
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: colors.backgroundSecondary, minWidth: '20px' }} />
                        <Typography variant="body2">
                            <strong>Deputy:</strong> {selectedCard.deputyMinister}
                        </Typography>
                    </Box>
                )}
                {selectedCard.stateMinister && (
                    <Box display="flex" alignItems="center">
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: colors.backgroundSecondary, minWidth: '20px' }} />
                        <Typography variant="body2">
                            <strong>State:</strong> {selectedCard.stateMinister}
                        </Typography>
                    </Box>
                )}
            </Stack> */}

          <Stack spacing={1} sx={{ mb: 2 }}>
            {personListForMinistry && personListForMinistry.length > 0 ? (
              personListForMinistry?.map((dep, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  size="medium"
                  sx={{
                    p: 1,
                    boxShadow: "none",
                    justifyContent: "flex-start",
                    backgroundColor: colors.backgroundPrimary,
                    color: "primary.main",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.buttonLight,
                      boxShadow: "none"
                    },
                    border: `1px solid ${colors.backgroundPrimary}10`
                  }}
                  fullWidth
                  // onClick={() => onDepartmentClick(dep)}
                >
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 1, color: colors.backgroundSecondary }}
                  />
                  {utils.extractNameFromProtobuf(dep.name)}
                </Button>
              ))
            ) : (
              <Box>
                <Alert
                  severity="info"
                  sx={{
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <AlertTitle>Info</AlertTitle>
                  No ministers assigned for the ministry
                </Alert>
              </Box>
            )}
          </Stack>
          {/* Departments */}
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1, fontSize: "1.5rem", fontWeight: 600 }}
          >
            Departments
          </Typography>
          <Stack spacing={1}>
            {departmentListForMinistry &&
            departmentListForMinistry.length > 0 ? (
              departmentListForMinistry?.map((dep, idx) => (
                <Button
                  key={idx}
                  variant="contained"
                  size="medium"
                  sx={{
                    p: 1,
                    boxShadow: "none",
                    justifyContent: "flex-start",
                    backgroundColor: colors.backgroundPrimary,
                    color: "primary.main",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.buttonLight,
                      boxShadow: "none",
                    },
                    border: `1px solid ${colors.backgroundPrimary}10`
                  }}
                  fullWidth
                  // onClick={() => onDepartmentClick(dep)}
                >
                  <AccountBalanceIcon
                    fontSize="small"
                    sx={{ mr: 2, color: colors.backgroundSecondary }}
                  />
                  {utils.extractNameFromProtobuf(dep.name)}
                </Button>
              ))
            ) : (
              <Box>
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "left",
                  }}
                >
                  <AlertTitle>Info</AlertTitle>
                  No departments created for the ministry
                </Alert>
              </Box>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default MinistryDrawerContent;
