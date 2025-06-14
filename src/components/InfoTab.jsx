import { Box, Button, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MinistryDrawerContent from "./MinistryDrawerContent";
import DepartmentHistoryTimeline from "./DepartmentHistoryTimeline";

const InfoTab = ({
  drawerOpen,
  drawerMode,
  selectedCard,
  selectedDepartment,
  selectedDate,
  onClose,
  onBack,
  onDepartmentClick,
}) => {
  return (
    <Drawer anchor="right" open={drawerOpen} onClose={onClose}>
      <Box
        sx={{
          width: {
            xs: 350,
            sm: 450,
            md: 650,
            lg: 700,
            xl: 750,
          },
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {drawerMode === "department" ? (
            <Button onClick={onBack}>← Back</Button>
          ) : (
            <Box width={75} /> // spacer
          )}

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1 }}>
          {drawerMode === "ministry" && selectedCard && (
            <MinistryDrawerContent
              selectedCard={selectedCard}
              selectedDate={selectedDate}
              onDepartmentClick={onDepartmentClick}
            />
          )}

          {drawerMode === "department" && selectedDepartment && (
            <DepartmentHistoryTimeline
              selectedDepartment={selectedDepartment}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default InfoTab;
