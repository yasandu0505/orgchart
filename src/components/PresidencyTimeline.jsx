import { useState, useRef } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const presidents = [
     {
        name: "Maitripala Sirisena",
        year: "2015–2019",
        image:
            "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ81rAgch6umHN8b0vOk6OQDgeumC2Mlb4kU7GNm2lC8uUrjJfh5IykCTJRnK_LE77JMFc_JBtquU9a8G2SsW2vMcBt5AdvHVwwsNW30Fo",
    },
    {
        name: "Gotabaya Rajapaksa",
        year: "2019–2022",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5DIe5WDP4wAlZxj5esqZ10RdUTz8YKBInw&s",
    },
    {
        name: "Ranil Wickremesinghe",
        year: "2022–2024",
        image: "https://unp.lk/assets/main/images/ranil/president-ranil.jpg",
    },
    {
        name: "Anura Kumara Dissanayake",
        year: "2024–present",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdOoGPxjbGmDh3erxJupQRQRIDT7IwIBNwbw&s",
    },
     
];

export default function PresidencyTimeline() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const scrollRef = useRef(null);

    // Scroll timeline container left/right by 100px on arrow click
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
                overflow: "hidden", // ensures the line doesn’t overflow
            }}
        >
            {/* Left Arrow */}
            <IconButton
                onClick={() => scroll("left")}
                sx={{ zIndex: 10, mt: -7 }}
                aria-label="scroll left"
                
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Timeline Line */}
            <Box
                sx={{
                    position: "absolute",
                    top: "calc(50% - 30px)", // vertically aligns with avatar center
                    left: 60, // offset to account for left arrow button
                    right: 60, // offset to account for right arrow button
                    height: "3px",
                    backgroundColor: "#ccc",
                    zIndex: 0,
                }}
            />

            {/* Scrollable timeline container */}
            <Box
                ref={scrollRef}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 14,
                    padding: 4,
                    paddingLeft: 10,
                    paddingRight: 10,
                    flexWrap: "nowrap",
                    scrollBehavior: "smooth",
                    flexGrow: 1,
                    position: "relative",
                    zIndex: 1, // avatars above the line
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
                            onClick={() => {
                                setSelectedIndex(index);
                                scrollRef.current?.children[index]?.scrollIntoView({
                                    behavior: "smooth",
                                    inline: "center",
                                });
                            }}
                            sx={{
                                cursor: "pointer",
                                textAlign: "center",
                                transform: isSelected ? "scale(1.3)" : "scale(1)",
                                transition: "all 0.3s ease",
                                minWidth: 100,
                                flexShrink: 0,
                            }}
                        >
                            <Avatar
                                src={president.image}
                                alt={president.name}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: isSelected ? "3px solid #1976d2" : "2px solid gray",
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
                    );
                })}
            </Box>

            {/* Right Arrow */}
            <IconButton
                onClick={() => scroll("right")}
                sx={{ zIndex: 10, mt: -7 }}
                aria-label="scroll right"
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>

    );
}
