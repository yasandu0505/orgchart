import * as React from "react";
import { Box, Typography } from "@mui/material";
import colors from "../assets/colors";

export default function GazetteTimeline({ data, onSelectDate, triggerExpand, onMeasureStart }) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);
    const containerRef = React.useRef(null);
    const dotRefs = React.useRef([]);

    const [lineStyle, setLineStyle] = React.useState({ left: 0, width: 0 });

    React.useEffect(() => {
        setExpanded(false);
        const timer = setTimeout(() => setExpanded(true), 50);
        return () => clearTimeout(timer);
    }, [triggerExpand]);

    React.useEffect(() => {
        if (!containerRef.current || !dotRefs.current[0]) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const firstDot = dotRefs.current[0].getBoundingClientRect();
        const selectedDot = dotRefs.current[selectedIndex]?.getBoundingClientRect();

        const centerX = firstDot.left + firstDot.width / 2;
        if (onMeasureStart) onMeasureStart(centerX);

        if (firstDot && selectedDot) {
            const left = firstDot.left - containerRect.left + firstDot.width / 2;
            const right = selectedDot.left - containerRect.left + selectedDot.width / 2;
            const width = Math.abs(right - left);
            setLineStyle({ left: Math.min(left, right), width });
        }
    }, [selectedIndex, data, onMeasureStart]);

    if (!data || data.length === 0) return <Typography>No dates to display</Typography>;

    return (
        <Box sx={{ overflow: "hidden", py: 4, width: "100%", position: "relative" }} ref={containerRef}>
            <Box
                sx={{
                    position: "absolute",
                    height: "2.5px",
                    backgroundColor: colors.timelineLineActive,
                    top: 37.2,
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
                            onClick={() => {
                                setSelectedIndex(index);
                                onSelectDate(item.date);
                            }}
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
                                    backgroundColor: isSelected ? colors.dotColorActive : colors.dotColorInactive,
                                    border: "2px solid white",
                                    margin: "auto",
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{
                                    mt: 1,
                                    whiteSpace: "nowrap",
                                    color: isSelected ? colors.dotColorActive : colors.dotColorInactive,
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
