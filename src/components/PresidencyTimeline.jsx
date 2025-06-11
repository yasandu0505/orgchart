import React, { useState, useRef } from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const presidents = [
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
            }}
        >
            {/* Left Arrow */}
            <IconButton
                onClick={() => scroll("left")}
                sx={{ zIndex: 10 }}
                aria-label="scroll left"
            >
                <ArrowBackIosNewIcon />
            </IconButton>

            {/* Scrollable timeline container */}
            <Box
                ref={scrollRef}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    justifyContent: "center",
                    padding: 4,
                    gap: 15,
                    flexWrap: "nowrap",
                    scrollBehavior: "smooth",
                    flexGrow: 1,
                    position: "relative",
                    /* Hide scrollbar for WebKit browsers */
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    /* Hide scrollbar for Firefox */
                    scrollbarWidth: "none",
                    /* Hide scrollbar for IE, Edge */
                    msOverflowStyle: "none",
                }}
            >
                {/* Timeline line behind avatars */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "50px", // align with avatar center
                        left: 0,
                        right: 0,
                        height: "3px",
                        backgroundColor: "#ccc",
                        zIndex: 0,
                    }}
                />

                {presidents.map((president, index) => {
                    const isSelected = index === selectedIndex;

                    return (
                        <Box
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            sx={{
                                cursor: "pointer",
                                textAlign: "center",
                                transform: isSelected ? "scale(1.3)" : "scale(1)",
                                transition: "all 0.3s ease",
                                position: "relative",
                                zIndex: 1,
                            }}
                        >
                            <Avatar
                                src={president.image}
                                alt={president.name}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    border: isSelected
                                        ? "3px solid #1976d2"
                                        : "2px solid gray",
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
                sx={{ zIndex: 10 }}
                aria-label="scroll right"
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
}
