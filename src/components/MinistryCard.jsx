// src/components/MinistryCard.jsx

import { Card, Typography, Box, Stack, Avatar } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import colors from "../assets/colors";
import utils from "../utils/utils";

const MinistryCard = ({ card, onClick }) => {
  return (
    <Card
      sx={{
        cursor: "pointer",
        boxShadow: 3,
        borderLeft: ``,
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: 2,
          borderLeftColor: colors.backgroundSecondary,
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
          {/* <Avatar sx={{ bgcolor: colors.backgroundSecondary, width: 28, height: 28 }}>
                        <GroupsIcon fontSize="small" />
                    </Avatar> */}
          <Typography variant="h7" sx={{ color: "#ffffff" }}>
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
              <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                Minister
              </Typography>

              {card.headMinisterName ? (
                <Typography variant="subtitle2">
                  {utils.extractNameFromProtobuf(card.headMinisterName)}
                </Typography>
              ) : (
                <Typography variant="subtitle2" sx={{ color: colors.textMuted }}>
                  Not Assigned
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
