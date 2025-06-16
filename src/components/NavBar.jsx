import React, { useState } from "react";
import { Box, Button, Stack } from "@mui/material";
import colors from "../assets/colors";
import ModernView from "./modernView";
import OrgChart from "./orgchart";

function Navbar() {
  const [view, setView] = useState("modern");

  const handleViewChange = (type) => {
    setView(type);
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
          width: "100%",
          display: "flex",
          justifyContent: "center",
          zIndex: 1000,
        }}
      >
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
  );
}

export default Navbar;
