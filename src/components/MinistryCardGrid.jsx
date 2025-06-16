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
  const allPersonList = useSelector((state) => state.allPerson.allPerson);


  useEffect(() => {
    fetchMinistryList();
  }, [selectedDate, allMinistryData]);

const fetchMinistryList = async () => {
  if (!selectedDate || !allMinistryData || allMinistryData.length === 0)
    return;

  try {
    setLoading(true);
    console.log("finding active ministry");
    const activeMinistry = await api.fetchActiveMinistries(
      selectedDate,
      allMinistryData
    );

    const enrichedMinistries = await Promise.all(
      activeMinistry.children.map(async (ministry) => {
        const response = await api.fetchActiveRelationsForMinistry(
          selectedDate.date,
          ministry.id,
          "AS_APPOINTED"
        );
        const res = await response.json();

        const personSet = new Set(res.map((person) => person.relatedEntityId));
        const personListInDetail = allPersonList.filter((person) =>
          personSet.has(person.id)
        );

        const headMinisterName = personListInDetail[0]?.name || null;
        console.log(headMinisterName)
        return {
          ...ministry,
          headMinisterName, 
        };
      })
    );

    setActiveMinistryList(enrichedMinistries);
    console.log(enrichedMinistries)
    setLoading(false);
  } catch (e) {
    console.log("error fetch ministry list : ", e.message);
    setLoading(false);
  }
};


  return (
    <Box sx={{ px: 4, pb: 4 }}>
      <Box
        sx={{
          px: {
            xs: 0,
            sm: 0,
            md: 5,
            lg: 10,
            xl: 20
          },
          py: {
            xs: 2,
            sm: 3,
            md: 5,
          },
          overflowX: "auto",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h7" sx={{ color: "text.secondary" }}>
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
            spacing={2}
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
                    flexBasis: {
                      xs: "100%",
                      sm: "50%",
                      md: "25%",
                      lg: "16.66%",
                    },
                    maxWidth: {
                      xs: "100%",
                      sm: "50%",
                      md: "25%",
                      lg: "16.66%",
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
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Alert severity="info" sx={{ backgroundColor: "transparent" }}>
                  <AlertTitle>Info</AlertTitle>
                  No ministries in the goverment. Sometimes this can be the
                  president appointed date.
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
