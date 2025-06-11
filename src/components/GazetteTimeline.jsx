import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function GazetteTimeline({ data, onSelectDate, triggerExpand }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);

    React.useEffect(() => {
        // Whenever triggerExpand changes, start animation
        setExpanded(false);  // reset to collapsed
        const timer = setTimeout(() => {
            setExpanded(true); // expand after a tick
        }, 50);
        return () => clearTimeout(timer);
    }, [triggerExpand]);

    const handleClick = (index) => {
        setSelectedIndex(index);
        onSelectDate(data[index].date);
    };

    if (!data || data.length === 0) {
        return <Typography>No dates to display</Typography>;
    }

    return (
        <Box
            sx={{
                overflow: "hidden",
                py: 4,
                width: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    transformOrigin: "left center",
                    transition: "transform 0.5s ease",
                    transform: expanded ? "scaleX(1)" : "scaleX(0)",
                    ml: 2,
                    mr: 2
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
