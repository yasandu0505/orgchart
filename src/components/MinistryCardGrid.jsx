import {
  Box,
  Grid,
  Typography,
  Alert,
  AlertTitle,
  Divider,
  Chip,
} from "@mui/material";
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

          const personSet = new Set(
            res.map((person) => person.relatedEntityId)
          );
          const personListInDetail = allPersonList.filter((person) =>
            personSet.has(person.id)
          );

          const headMinisterName = personListInDetail[0]?.name || null;
          return {
            ...ministry,
            headMinisterName,
          };
        })
      );

      setActiveMinistryList(enrichedMinistries);
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
          py: {
            xs: 2,
            sm: 3,
            md: 5,
          },
          overflowX: "auto",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", fontFamily: "poppins" }}
          >
            Gazette Date
          </Typography>
          <Divider>
            <Chip
              label={selectedDate.date}
              sx={{
                backgroundColor: "transparent",
                fontWeight: "bold",
                color: colors.textSecondary,
                fontFamily: "poppins",
                fontSize: 25,
                P: 1,
              }}
            />
          </Divider>
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
              p: 1,
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
                      sm: "48%",
                      md: "31.5%",
                      lg: "23.5%",
                    },
                    maxWidth: {
                      xs: "100%",
                      sm: "48%",
                      md: "31.5%",
                      lg: "23.5%",
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
                  <AlertTitle sx={{ fontFamily: "poppins" }}>
                    Info: No ministries in the goverment. Sometimes this can be
                    the president appointed date.
                  </AlertTitle>
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
