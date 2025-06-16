import React, { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PresidencyTimeline from "./PresidencyTimeline";
import colors from "../assets/colors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import InfoTab from "./InfoTab";
import MinistryCardGrid from "./MinistryCardGrid";
import api from "../services/services";
import utils from "../utils/utils";
import { setAllPerson } from "../store/allPersonList";
import {
  setPresidentRelationList,
  setPresidentList,
  setSelectedPresident,
  setSelectedDate,
} from "../store/presidencySlice";
import { setGazetteData } from "../store/gazetteDate";
import { setAllMinistryData } from "../store/allMinistryData";
import { setAllDepartmentData } from "../store/allDepartmentData";
import presidentDetails from "./../assets/personImages.json";

const ModernView = () => {
  const dispatch = useDispatch();
  const { selectedDate, selectedPresident, presidentRelationList } =
    useSelector((state) => state.presidency);
  const { selectedMinistry } = useSelector((state) => state.allMinistryData);
  const presidents = useSelector((state) => state.presidency.presidentList);
  //   const selectedPresident =
  //     selectedIndex !== null ? presidents[selectedIndex] : null;

  const [view, setView] = useState("modern");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [drawerMode, setDrawerMode] = useState("ministry");
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  //loading
  const [loading, setLoading] = useState(false);

  const handleViewChange = (type) => {
    setView(type);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setDrawerMode("ministry");
    setSelectedDepartment(null);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedCard(null);
    setDrawerMode("ministry");
    setSelectedDepartment(null);
  };

  const handleDepartmentClick = (dep) => {
    setSelectedDepartment(dep);
    setDrawerMode("department");
  };

  useEffect(() => {
    const initialFetchData = async () => {
      setLoading(true);
      try {
        await fetchPersonData();
        await fetchAllMinistryData();
        await fetchAllDepartmentData();
        setLoading(false);
      } catch (e) {
        console.error("Error loading initial data:", e.message);
      }
    };

    initialFetchData();
  }, []);

  const fetchPersonData = async () => {
    try {
      const personResponse = await api.fetchAllPersons();
      const personList = await personResponse.json();
      dispatch(setAllPerson(personList.body));

      //this is for president data
      const presidentResponse = await api.fetchPresidentsData();
      dispatch(setPresidentRelationList(presidentResponse));

      const presidentSet = new Set(
        presidentResponse.map((p) => p.relatedEntityId)
      );

      const presidentListInDetail = personList.body.filter((person) =>
        presidentSet.has(person.id)
      );

      const enrichedPresidents = presidentListInDetail.map((president) => {
        const matchedDetail = presidentDetails.find((detail) =>
          detail.presidentName
            .toLowerCase()
            .includes(
              utils
                .extractNameFromProtobuf(president.name)
                .split(":")[0]
                .toLowerCase()
            )
        );

        return {
          ...president,
          imageUrl: matchedDetail?.imageUrl || null, // fallback if no match
        };
      });

      dispatch(setPresidentList(enrichedPresidents));
      dispatch(
        setSelectedPresident(enrichedPresidents[enrichedPresidents.length - 1])
      );
    } catch (e) {
      console.log(`Error fetching person data : ${e.message}`);
    }
  };

  useEffect(() => {
    if (selectedPresident?.created) {
      clearCurrentLists();
      const matchedPresidentRelation = presidentRelationList.find(
        (obj) => obj.startTime == selectedPresident.created
      );
      fetchGazetteData(matchedPresidentRelation);
    }
  }, [selectedPresident]);

  const fetchGazetteData = async (selectedPresident) => {
    try {
      const startTime = selectedPresident.startTime.split("T")[0];
      const endTime = selectedPresident.endTime.split("T")[0];

      const { dates, allMinistryData } = await api.fetchInitialGazetteData();

      var filteredDates = [];
      if (endTime == "") {
        filteredDates = dates.filter((date) => date >= startTime);
      } else {
        filteredDates = dates.filter(
          (date) => date >= startTime && date <= endTime
        );
      }

      const transformed = filteredDates.map((date) => ({ date: date }));

      dispatch(setGazetteData(transformed));
      // dispatch(setAllMinistryData(allMinistryData));

      if (transformed.length > 0) {
        dispatch(setSelectedDate(transformed[transformed.length - 1]));
      }
    } catch (e) {
      console.log(`Error fetching gazette data : ${e.message}`);
    }
  };

  const fetchAllDepartmentData = async () => {
    try {
      const response = await api.fetchAllDepartments();
      const departmentList = await response.json();
      console.log("department fetched", departmentList.body);
      dispatch(setAllDepartmentData(departmentList.body));
    } catch (e) {
      console.log(`Error fetching department data : ${e.message}`);
    }
  };

  const fetchAllMinistryData = async () => {
    try {
      const response = await api.fetchAllMinistries();
      const ministryList = await response.json();
      console.log("department fetched", ministryList.body);
      dispatch(setAllMinistryData(ministryList.body));
    } catch (e) {
      console.log(`Error fetching ministry data : ${e.message}`);
    }
  };

  const clearCurrentLists = () => {
    // setDepartmentListForMinistry([]);
    // setPersonListForMinistry([]);
  };

  return (
    <Box
      sx={{
        paddingTop: "10px",
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: colors.backgroundPrimary,
        overflowX: "hidden",
      }}
    >
      {/* Search Bar */}
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
          p: 2,
          justifyContent: "center",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            input: { color: colors.textSearch },
            label: { color: colors.textSearch },
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#1565c0" },
              "&:hover fieldset": { borderColor: colors.textSearch },
              "&.Mui-focused fieldset": { borderColor: colors.textSearch },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            minWidth: 120,
            height: "40px",
            fontWeight: 600,
            backgroundColor: colors.textSearch,
            color: "#fff",
            textTransform: "none",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Search
        </Button>
      </Box> */}

      {/* View Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            border: `2px solid ${colors.primary}25`,
            p: 2,
            borderRadius: "50px",
            backgroundColor: colors.white,
          }}
        >
          {["modern", "classic"].map((type) => (
            <Button
              key={type}
              variant={view === type ? "contained" : "outlined"}
              onClick={() => handleViewChange(type)}
              sx={{
                color: view === type ? "#fff" : colors.primary,
                backgroundColor: view === type ? colors.primary : "transparent",
                borderColor: colors.primary,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor:
                    view === type ? colors.primary : `${colors.primary}22`, // light hover tint
                  borderColor: colors.primary,
                },
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </Stack>
      </Box>

      {loading ? (
        <Box
          sx={{
            paddingTop: "25vh",
            width: "100vw",
            height: "100vh",
            backgroundColor: colors.backgroundPrimary,
            display: "flex",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <CircularProgress color="success" value={75} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", mt: 5, justifyContent: "center" }}>
            <PresidencyTimeline />
          </Box>

          <Box
            sx={{
              border: `2px solid ${colors.primary}10`,
              p: 3,
              mx:25,
              my:2,
              borderRadius: "15px",
              backgroundColor: colors.white,
            }}
          >
            {/* Selected Info Card */}
            <Box
              sx={{
                textAlign: "left",
                width: "100%",
                display: "flex",
                justifyContent: "Center",
              }}
            >
              
              <Card
                sx={{
                  width: {
                    sm: "45%",
                    lg: "25%",
                  },
                  marginRight: 1,
                  border: `2px solid ${colors.secondary}50`,
                  borderRadius: "15px",
                  backgroundColor: colors.white,
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    width: "175px",
                    height: "35px",
                    backgroundColor: `${colors.secondary}`,
                    borderBottomRightRadius: "15px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colors.white,
                      fontSize: 18,
                      textAlign: "center",
                      justifyItems: "center",
                      pt: "5px",
                    }}
                  >
                    President
                  </Typography>
                </Box>
                <Box sx={{ padding: 1 }}>
                  {selectedPresident && (
                    <>
                      <Box
                        direction="row"
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          ml: "20px",
                          my: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            borderRadius: "50%",
                          }}
                        >
                          <Avatar
                            src={selectedPresident.imageUrl}
                            alt={selectedPresident.name}
                            sx={{
                              width: 75,
                              height: 75,
                              border: "3px solid white",
                              backgroundColor: "white",
                              margin: "auto",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "block",
                            justifyContent: "left",
                            ml: "15px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 20,
                              whiteSpace: "normal",
                              overflow: "visible",
                              textOverflow: "unset",
                              wordBreak: "break-word",
                              fontFamily: "poppins",
                              color: colors.textPrimary,
                            }}
                          >
                            {utils.extractNameFromProtobuf(
                              selectedPresident.name
                            )}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 18, color: colors.textMuted }}
                          >
                            {selectedPresident.created.split("-")[0]} -
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>
              <Card
                sx={{
                  width: {
                    sm: "45%",
                    lg: "25%",
                  },
                  marginRight: 1,
                  border: `2px solid ${colors.secondary}50`,
                  borderRadius: "15px",
                  backgroundColor: colors.white,
                  boxShadow: "none",
                }}
              >
                <Box
                  sx={{
                    width: "175px",
                    height: "35px",
                    backgroundColor: colors.secondary,

                    borderBottomRightRadius: "15px",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: colors.white,
                      fontSize: 18,
                      textAlign: "center",
                      justifyItems: "center",
                      pt: "5px",
                    }}
                  >
                    Prime Minister
                  </Typography>
                </Box>
                <Box sx={{ padding: 1 }}>
                  {selectedPresident && (
                    <>
                      <Box
                        direction="row"
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          ml: "20px",
                          my: "10px",
                        }}
                      >
                        <Box
                          sx={{
                            borderRadius: "50%",
                          }}
                        >
                          <Avatar
                            src={selectedPresident.imageUrl}
                            alt={selectedPresident.name}
                            sx={{
                              width: 75,
                              height: 75,
                              border: "3px solid white",
                              backgroundColor: "white",
                              margin: "auto",
                            }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "block",
                            justifyContent: "left",
                            ml: "15px",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 20,
                              color: colors.textPrimary,
                              whiteSpace: "normal", // allow wrapping
                              overflow: "visible", // show overflow content
                              textOverflow: "unset", // disable text truncation
                              wordBreak: "break-word", // break long words if needed
                            }}
                          >
                            {utils.extractNameFromProtobuf(
                              selectedPresident.name
                            )}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 18, color: colors.textMuted }}
                          >
                            {selectedPresident.created.split("-")[0]} - 
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              </Card>
            </Box>

            {/* Card Grid for Modern View */}
            {view === "modern" && selectedDate != null && (
              <MinistryCardGrid onCardClick={handleCardClick} />
            )}
          </Box>
        </>
      )}

      {/* Right Drawer */}
      <InfoTab
        drawerOpen={drawerOpen}
        drawerMode={drawerMode}
        selectedCard={selectedCard}
        selectedDepartment={selectedDepartment}
        selectedDate={selectedDate}
        onClose={handleDrawerClose}
        onBack={() => setDrawerMode("ministry")}
        onDepartmentClick={handleDepartmentClick}
        ministryId={selectedMinistry}
      />
    </Box>
  );
};

export default ModernView;
