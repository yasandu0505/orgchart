// src/components/MinistryCard.jsx

import { Card, Typography, Box, Stack, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import colors from "../assets/colors";
import utils from "../utils/utils";
import { useSelector } from "react-redux";

const MinistryCard = ({ card, onClick }) => {

  const {selectedPresident} = useSelector((state) => state.presidency);



  return (
    <Card
      sx={{
        cursor: "pointer",
        boxShadow: "none",
        border: `2px solid ${colors.backgroundSecondary}50`,
        transition: "box-shadow 0.2s",
        "&:hover": {
          border: `2px solid ${colors.backgroundSecondary}`,
        },
        "&:active": {
          border: `2px solid ${colors.backgroundSecondary}`,
          backgroundColor: "#ececf5",
        },
        backgroundColor: "#f9f9fc",
        borderRadius: "10px",
      }}
      onClick={() => onClick(card)}
    >
      <Stack>
        {/* Title with icon */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          minHeight={50}
          sx={{ px: 2, py: 1, backgroundColor: colors.backgroundSecondary }}
        >
          <Typography variant="h7" sx={{ color: "#ffffff" , fontWeight: 600}}>
            {card.name.split(":")[0]}
          </Typography>
        </Stack>

        {/* Ministers */}
        <Stack spacing={0.5} sx={{ p: 1, minHeight: 60 }}>
          <Stack direction="row" spacing={1}>
            <PersonIcon
              sx={{ color: colors.backgroundSecondary, alignSelf: "center" }}
              fontSize="small"
            />
            <Stack direction="column" spacing={0}>
              {card.headMinisterName ? (
               <Typography variant="subtitle2" sx={{ color: colors.textSecondary, fontFamily: "poppins", py:"5px", pr:"10px" }}>
                Minister
              </Typography>
              ) : (
               <Box sx={{display: "flex"}}>
                 <Typography variant="subtitle2" sx={{ color: colors.textSecondary, fontFamily: "poppins" , py:"5px",  pr:"8px"  }}>
                 Minister
              </Typography>
                <Typography variant="subtitle2" sx={{ color: colors.textSecondary, fontFamily: "poppins", py:"5px", px: "8px", backgroundColor: `${colors.green}50`, borderRadius: "5px" }}>
                President
              </Typography>
               </Box>
              )}

              {card.headMinisterName ? (
                <Typography variant="subtitle2" sx={{fontWeight: 600, color: colors.textPrimary, fontFamily: "poppins"}}>
                  {utils.extractNameFromProtobuf(card.headMinisterName)}
                </Typography>
              ) : (
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.textPrimary, fontFamily: "poppins" }}
                >
                  {selectedPresident && utils.extractNameFromProtobuf(selectedPresident.name).split(":")[0]}
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon
              sx={{ color: colors.backgroundSecondary }}
              fontSize="small"
            />
            <Typography variant="body2">
              <strong>Deputy:</strong> {card.deputyMinister || "—"}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <PersonIcon
              sx={{ color: colors.backgroundSecondary }}
              fontSize="small"
            />
            <Typography variant="body2">
              <strong>State:</strong> {card.stateMinister || "—"}
            </Typography>
          </Stack> */}
        </Stack>
      </Stack>
    </Card>
  );
};

export default MinistryCard;
