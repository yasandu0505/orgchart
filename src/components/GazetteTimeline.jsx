import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function GazetteTimeline({ data, onSelectDate, triggerExpand }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);
    const containerRef = React.useRef(null);
    const dotRefs = React.useRef([]);

    const [lineStyle, setLineStyle] = React.useState({ left: 0, width: 0 });

    React.useEffect(() => {
        setExpanded(false);
        const timer = setTimeout(() => {
            setExpanded(true);
        }, 50);
        return () => clearTimeout(timer);
    }, [triggerExpand]);

    const handleClick = (index) => {
        setSelectedIndex(index);
        onSelectDate(data[index].date);
    };

    React.useEffect(() => {
        if (!containerRef.current || !dotRefs.current[selectedIndex]) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const firstDot = dotRefs.current[0]?.getBoundingClientRect();
        const selectedDot = dotRefs.current[selectedIndex]?.getBoundingClientRect();

        if (firstDot && selectedDot) {
            const left = firstDot.left - containerRect.left + firstDot.width / 2;
            const right = selectedDot.left - containerRect.left + selectedDot.width / 2;
            const width = Math.abs(right - left);
            setLineStyle({
                left: Math.min(left, right),
                width,
            });
        }
    }, [selectedIndex, data]);

    if (!data || data.length === 0) {
        return <Typography>No dates to display</Typography>;
    }

    return (
        <Box
            sx={{
                overflow: "hidden",
                py: 4,
                width: "100%",
                position: "relative",
            }}
            ref={containerRef}
        >
            {/* Animated connecting line */}
            <Box
                sx={{
                    position: "absolute",
                    height: "2.5px",
                    backgroundColor: "#2593B8",
                    top: 37.5, // adjust to align vertically with dot centers
                    transition: "left 0.3s ease, width 0.3s ease",
                    ...lineStyle,
                }}
            />

            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    transformOrigin: "left center",
                    transition: "transform 0.5s ease",
                    transform: expanded ? "scaleX(1)" : "scaleX(0)",
                    ml: 2,
                    mr: 2,
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
                            ref={(el) => (dotRefs.current[index] = el)}
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
