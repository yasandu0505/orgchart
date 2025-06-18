import React, { useState, useEffect } from "react";
import { Box, Button, Stack, Typography, IconButton } from "@mui/material";
import colors from "../assets/colors";
import ModernView from "./modernView";
import OrgChart from "./orgchart";
import api from "./../services/services";
import utils from "./../utils/utils";
import { setAllMinistryData } from "../store/allMinistryData";
import { setAllDepartmentData, setDepartmentHistory } from "../store/allDepartmentData";
import { useSelector } from "react-redux";
import presidentDetails from "./../assets/personImages.json";
import { setAllPerson } from "../store/allPersonList";
import CircularProgress from "@mui/material/CircularProgress";
import {
  setPresidentRelationList,
  setPresidentList,
  setSelectedPresident,
} from "../store/presidencySlice";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDispatch } from "react-redux";
import { useThemeContext } from "../themeContext";

function Navbar() {
  const [view, setView] = useState("modern");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleViewChange = (type) => {
    setView(type);
  };

  const { isDark, toggleTheme } = useThemeContext();

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

  const fetchAllDepartmentData = async () => {
    try {
      const response = await api.fetchAllDepartments();
      const departmentList = await response.json();
      dispatch(setAllDepartmentData(departmentList.body));
    } catch (e) {
      console.log(`Error fetching department data : ${e.message}`);
    }
  };

  const fetchAllMinistryData = async () => {
    try {
      const response = await api.fetchAllMinistries();
      const ministryList = await response.json();
      dispatch(setAllMinistryData(ministryList.body));
      console.log(ministryList.body)
      const dictionary = await api.createDepartmentHistoryDictionary(ministryList.body);
      dispatch(setDepartmentHistory(dictionary))
      console.log("Department History Dictionary:", dictionary);

    } catch (e) {
      console.log(`Error fetching ministry data : ${e.message}`);
    }
  };

  return (
    <>
      {/* View Buttons */}
      {/* <Box>
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            height: "50px",
            padding: "10px 20px",
            flexShrink: 0,
            color: colors.textPrimary
          }}
        >
          <h2>Organization Chart</h2>
        </div>
      </Box> */}
      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: "98%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
            border: `2px solid ${colors.primary}25`,
            p: 2,
            borderRadius: "50px",
            backgroundColor: `${colors.backgroundPrimary}99`,
            justifyItems: "center",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            fontSize={25}
            fontWeight={"bold"}
            sx={{ color: colors.textPrimary, flex: 1, textAlign: "left" }}
          >
            ORGCHART 2.0
          </Typography>
          <Box>
            {["modern", "classic"].map((type) => (
              <Button
                key={type}
                variant={view === type ? "contained" : "outlined"}
                onClick={() => handleViewChange(type)}
                sx={{
                  fontFamily: "poppins",
                  color: view === type ? "#fff" : colors.primary,
                  backgroundColor:
                    view === type ? colors.primary : "transparent",
                  borderColor: colors.primary,
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "50px",
                  px: 3,
                  py: 1,
                  m: 0.5,
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
          </Box>
          <Box sx={{ color: colors.textPrimary, flex: 1, textAlign: "right" }}>
            <IconButton sx={{ ml: 1 }} onClick={()=>{toggleTheme();console.log('is dark : ',isDark)}} color="inherit">
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
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
          {view == "modern" ? (
            <>
              <ModernView />
            </>
          ) : (
            <>
              <OrgChart />
            </>
          )}
        </>
      )}
    </>
  );
}

export default Navbar;
