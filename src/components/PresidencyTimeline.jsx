import React, { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import GazetteTimeline from "./GazetteTimeline";
import colors from "../assets/colors";
import { presidents } from "../presidents";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedIndex, setSelectedDate } from "../store/presidencySlice";

export default function PresidencyTimeline() {
    const dispatch = useDispatch();
    const selectedIndex = useSelector((state) => state.presidency.selectedIndex);
    const selectedDate = useSelector((state) => state.presidency.selectedDate);
    const scrollRef = useRef(null);
    const avatarRef = useRef(null);
    const [lineProps, setLineProps] = useState({ left: 0, width: 0 });
    const [centerContent, setCenterContent] = useState(false);

    // This flag ensures we only do the initial auto-selection once
    const initialSelectionDone = React.useRef(false);

    useEffect(() => {
        // On mount, select last president and last date once
        if (!initialSelectionDone.current && presidents.length > 0) {
            const lastIndex = presidents.length - 1;
            const lastPresident = presidents[lastIndex];
            const lastDate = lastPresident.dates && lastPresident.dates.length > 0 ? lastPresident.dates[lastPresident.dates.length - 1].date : null;

            dispatch(setSelectedIndex(lastIndex));
            if (lastDate) {
                dispatch(setSelectedDate(lastDate));
            }
            initialSelectionDone.current = true;

            // Scroll last president into view smoothly
            setTimeout(() => {
                scrollRef.current?.children[lastIndex]?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                });
            }, 100);
        }
    }, [dispatch]);

    

    const handleDotMeasure = (dotX) => {
        if (avatarRef.current) {
            const avatarRect = avatarRef.current.getBoundingClientRect();
            const avatarCenterX = avatarRect.left + avatarRect.width / 2;
            const left = Math.min(avatarCenterX, dotX);
            const width = Math.abs(avatarCenterX - dotX);
            setLineProps({ left, width });
        }
    };

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 100;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                maxWidth: "100%",
                overflow: "hidden",
            }}
        >
            {/* Left scroll button */}
            <IconButton
                onClick={() => scroll("left")}
                sx={{ zIndex: 10, mt: -7 }}
                aria-label="scroll left"
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Background line */}
            <Box
                sx={{
                    position: "absolute",
                    top: "calc(50% - 30px)",
                    left: 50,
                    right: 50,
                    height: "3px",
                    backgroundColor: "#ccc",
                    zIndex: 0,
                }}
            />

            {/* Blue connecting line */}
            {selectedDate && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "50.2px",
                        height: "3px",
                        backgroundColor: colors.timelineLineActive,
                        left: lineProps.left,
                        width: lineProps.width,
                        transition: "left 0.3s ease, width 0.3s ease",
                        zIndex: 1,
                    }}
                />
            )}

            <Box
                ref={scrollRef}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 14,
                    padding: 4,
                    paddingLeft: 6,
                    paddingRight: 14,
                    flexWrap: "nowrap",
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
                {presidents.map((president, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <React.Fragment key={index}>
                            <Box
                                onClick={() => {
                                    if (selectedIndex === index) {
                                        dispatch(setSelectedIndex(null));
                                        dispatch(setSelectedDate(null));
                                    } else {
                                        dispatch(setSelectedIndex(index));

                                        const firstDate =
                                            president.dates && president.dates.length > 0
                                                ? president.dates[0].date
                                                : null;

                                        dispatch(setSelectedDate(firstDate));

                                       
                                    }
                                }}
                                sx={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transform: isSelected ? "scale(1.3)" : "scale(1)",
                                    transition: "all 0.3s ease",
                                    minWidth: 100,
                                    flexShrink: 0,
                                    position: "relative",
                                }}
                            >
                                <Avatar
                                    ref={isSelected ? avatarRef : null}
                                    src={president.image}
                                    alt={president.name}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        border: isSelected
                                            ? `3px solid ${colors.timelineLineActive}`
                                            : `2px solid ${colors.inactiveBorderColor}`,
                                        margin: "auto",
                                        backgroundColor: "white",
                                        filter: isSelected ? "none" : "grayscale(50%)",
                                    }}
                                />
                                <Typography variant="body2" sx={{ mt: 1, color: "black" }}>
                                    {president.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "gray" }}>
                                    {president.year}
                                </Typography>
                            </Box>

                            {isSelected && (
                                <Box sx={{ display: "flex", alignItems: "center", mt: -4, ml: -12, mr: -12 }}>
                                    <GazetteTimeline
                                        data={president.dates}
                                        onSelectDate={(date) => dispatch(setSelectedDate(date))}
                                        onMeasureStart={handleDotMeasure}
                                    />
                                </Box>
                            )}
                        </React.Fragment>
                    );
                })}
            </Box>

            {/* Right scroll button */}
            <IconButton
                onClick={() => scroll("right")}
                sx={{ zIndex: 10, mt: -7 }}
                aria-label="scroll right"
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    )
}