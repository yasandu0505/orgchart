import * as React from "react";
import { Box, Typography} from "@mui/material";

export default function GazetteTimeline({ data, onSelectDate }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const scrollRef = React.useRef(null);
  const [centerContent, setCenterContent] = React.useState(false);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkIfCentered = () => {
      const shouldCenter = container.scrollWidth <= container.clientWidth;
      setCenterContent(shouldCenter);
    };

    checkIfCentered();
    window.addEventListener("resize", checkIfCentered);
    return () => window.removeEventListener("resize", checkIfCentered);
  }, []);

  const handleClick = (index) => {
    setSelectedIndex(index);
    onSelectDate(data[index].date);
    scrollRef.current?.children[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  };

  if (!data || data.length === 0) {
    return <Typography>No dates to display</Typography>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        maxWidth: "100%",
        overflow: "hidden",
        py: 4,
      }}
    >

      {/* Scrollable Timeline */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 4,
          px: 4,
          scrollBehavior: "smooth",
          flexGrow: 1,
          position: "relative",
          zIndex: 1,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          justifyContent: centerContent ? "center" : "start",
        }}
      >
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <Box
              key={item.date}
              onClick={() => handleClick(index)}
              sx={{
                cursor: "pointer",
                textAlign: "center",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s ease",
                minWidth: 60,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: isSelected ? "#2593B8" : "#444",
                  border: "2px solid white",
                  margin: "auto",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  whiteSpace: "nowrap",
                  color: isSelected ? "#2593B8" : "#444",
                  fontSize: "0.8rem",
                }}
              >
                {item.date}
              </Typography>
            </Box>
          );
        })}
      </Box>

    </Box>
  );
}
