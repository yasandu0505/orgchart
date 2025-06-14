import { Box, Grid, Typography, Alert, AlertTitle } from "@mui/material";
import MinistryCard from "./MinistryCard";
import colors from "../assets/colors";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import api from "./../services/services";
import { ClipLoader } from "react-spinners";
import { setSelectedMinistry } from "../store/allMinistryData";

const MinistryCardGrid = ({ onCardClick }) => {
  const dispatch = useDispatch();
  const { allMinistryData } = useSelector((state) => state.allMinistryData);
  const { selectedDate } = useSelector((state) => state.presidency);
  const [activeMinistryList, setActiveMinistryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // console.log('selected date ', selectedDate)
  // console.log('all ministry data ', allMinistryData)

  // if (!selectedPresident || !selectedDate) return null;

  // const dateEntry = gazetteData.find(d => d.date === selectedDate);
  // if (!dateEntry || !Array.isArray(dateEntry.ministerList)) return null;

  // console.log('date entry : ', dateEntry)

  // const ministryCards = dateEntry.ministerList.map((minister, index) => ({
  //     id: index,
  //     title: minister.name,
  //     headMinister: minister.headMinister,
  //     deputyMinister: minister.deputyMinister,
  //     stateMinister: minister.stateMinister,
  //     departments: minister.departments,
  // }));

  useEffect(() => {
    console.log(selectedDate);
    fetchMinistryList();
  }, [selectedDate]);

  const fetchMinistryList = async () => {
    try {
      setLoading(true);
      console.log("finding active ministry");
      setActiveMinistryList([]);
      const activeMinistry = await api.fetchActiveMinistries(
        selectedDate,
        allMinistryData
      );
      console.log("active Ministry ", activeMinistry);
      setActiveMinistryList(activeMinistry.children);
      setLoading(false);
    } catch (e) {
      console.log("");
    }
  };

  return (
    <Box sx={{ px: 4, pb: 4 }}>
      <Box sx={{ px: 20, py: 5, overflowX: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Gazette Date
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: colors.textSecondary }}
          >
            {selectedDate.date}
          </Typography>
        </Box>

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
          <Grid
            container
            columns={12}
            columnSpacing={2}
            rowSpacing={2}
            sx={{
              border: `2px solid ${colors.primary}15`,
              p: 2,
              borderRadius: "15px",
              backgroundColor: colors.white,
            }}
          >
            {activeMinistryList && activeMinistryList.length > 0 ? (
              activeMinistryList.map((card) => (
                <Grid
                  key={card.id}
                  sx={{
                    gridColumn: {
                      xs: "span 12",
                      sm: "span 6",
                      md: "span 4",
                    },
                  }}
                >
                  <MinistryCard
                    card={card}
                    onClick={() => {
                      dispatch(setSelectedMinistry(card.id)), onCardClick(card);
                    }}
                  />
                </Grid>
              ))
            ) : (
              <Box  sx={{width: "100%", display: "flex", justifyContent: "center"}}>
                <Alert severity="info" sx={{backgroundColor: "transparent"}}>
                  <AlertTitle>Info</AlertTitle>
                  No ministries in the goverment. Sometimes this can be the president appointed date.
                </Alert>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MinistryCardGrid;
