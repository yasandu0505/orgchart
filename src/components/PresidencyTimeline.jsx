import { useEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
    const dotRef = useRef(null);
    const [lineStyle, setLineStyle] = useState(null);


    const initialSelectionDone = useRef(false);

    useEffect(() => {
        if (!initialSelectionDone.current && presidents.length > 0) {
            const lastIndex = presidents.length - 1;
            const lastPresident = presidents[lastIndex];
            const lastDate = lastPresident.dates?.[lastPresident.dates.length - 1]?.date || null;

            dispatch(setSelectedIndex(lastIndex));
            if (lastDate) dispatch(setSelectedDate(lastDate));
            initialSelectionDone.current = true;

            setTimeout(() => {
                scrollRef.current?.children[lastIndex]?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                });
            }, 100);
        }
    }, [dispatch]);

    const scroll = (direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = 100;
        scrollRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    const drawLine = () => {
        if (!avatarRef.current || !dotRef.current || !scrollRef.current) {
            setLineStyle(null);
            return;
        }

        const avatarBox = avatarRef.current.getBoundingClientRect();
        const dotBox = dotRef.current.getBoundingClientRect();
        const containerBox = scrollRef.current.getBoundingClientRect();

        // Start X = right edge of avatar
        const startX = avatarBox.left + avatarBox.width;

        // End X = center of dot (small circle)
        const endX = dotBox.left + dotBox.width / 2 + 34;

        // Vertical alignment calculation
        const containerHeight = containerBox.height;
        const top = containerHeight / 2 - 30;

        setLineStyle({
            left: startX - containerBox.left,
            width: endX - startX,
            top,
        });
    };

    useEffect(() => {
        drawLine();
    }, [selectedIndex, selectedDate]);

    useEffect(() => {
        drawLine();

        window.addEventListener("resize", drawLine);
        const scrollContainer = scrollRef.current;
        scrollContainer?.addEventListener("scroll", drawLine);

        return () => {
            window.removeEventListener("resize", drawLine);
            scrollContainer?.removeEventListener("scroll", drawLine);
        };
    }, []);

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
            <IconButton onClick={() => scroll("left")} sx={{ zIndex: 10, mt: -7 }}>
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Background timeline line */}
            <Box
                sx={{
                    position: "absolute",
                    top: "calc(50% - 30px)",
                    left: 50,
                    right: 50,
                    height: "3px",
                    backgroundColor: colors.timelineColor,
                    zIndex: 0,
                }}
            />

            {/* Blue connector line */}
            {lineStyle && selectedIndex !== null && selectedDate && (
                <Box
                    sx={{
                        position: "absolute",
                        height: "3px",
                        backgroundColor: colors.timelineLineActive,
                        top: `${lineStyle.top}px`,
                        left: `${lineStyle.left}px`,
                        width: `${lineStyle.width}px`,
                        zIndex: 1,
                        transition: "left 0.3s ease, width 0.3s ease",
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
                }}
            >
                {presidents.map((president, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <Box
                            key={index}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                flexShrink: 0,
                                transition: "all 0.3s ease",
                            }}
                        >
                            <Box
                                onClick={() => {
                                    if (isSelected) {
                                        dispatch(setSelectedIndex(null));
                                        dispatch(setSelectedDate(null));
                                    } else {
                                        dispatch(setSelectedIndex(index));
                                        const firstDate = president.dates?.[0]?.date;
                                        if (firstDate) dispatch(setSelectedDate(firstDate));
                                    }
                                }}
                                sx={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                    transform: isSelected ? "scale(1.3)" : "scale(1)",
                                    transition: "all 0.3s ease",
                                    minWidth: 80,
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
                                        backgroundColor: "white",
                                        margin: "auto",
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

                            {isSelected && president.dates?.length > 0 && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        transition: "all 0.3s ease",
                                        ml: 1,
                                        pr: 2,
                                    }}
                                >
                                    {president.dates.map((item) => {
                                        const isDateSelected = item.date === selectedDate;
                                        return (
                                            <Box
                                                key={item.date}
                                                onClick={() => dispatch(setSelectedDate(item.date))}
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    transform: isDateSelected ? "scale(1.1)" : "scale(1)",
                                                    transition: "transform 0.2s ease",
                                                    mt: "-32px",
                                                }}
                                            >
                                                <Box
                                                    ref={isDateSelected ? dotRef : null}
                                                    sx={{
                                                        width: 10,
                                                        height: 10,
                                                        borderRadius: "50%",
                                                        backgroundColor: isDateSelected
                                                            ? colors.dotColorActive
                                                            : colors.dotColorInactive,
                                                        border: "2px solid white",
                                                    }}
                                                />
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        mt: 0.5,
                                                        color: isDateSelected
                                                            ? colors.dotColorActive
                                                            : colors.dotColorInactive,
                                                        fontSize: "0.7rem",
                                                    }}
                                                >
                                                    {item.date}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            <IconButton onClick={() => scroll("right")} sx={{ zIndex: 10, mt: -7 }}>
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
}