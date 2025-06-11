import React, { useState } from "react";
import { Box, Avatar, Typography, Stack } from "@mui/material";

const presidents = [
    {
        name: "Gotabaya Rajapaksa",
        year: "2019–2022",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5DIe5WDP4wAlZxj5esqZ10RdUTz8YKBInw&s",
    },
    {
        name: "Ranil Wickremesinghe",
        year: "2022–2024",
        image: "https://unp.lk/assets/main/images/ranil/president-ranil.jpg",
    },
    {
        name: "Anura Kumara Dissanayake",
        year: "2024–present",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdOoGPxjbGmDh3erxJupQRQRIDT7IwIBNwbw&s",
    },
];

export default function PresidencyTimeline() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Box
            sx={{
                display: "flex",
                overflowX: "auto",
                justifyContent: "center",
                padding: 4,
                gap: 15,
                maxWidth: "100%",
                flexWrap: "nowrap",
            }}
        >

            {presidents.map((president, index) => {
                const isSelected = index === selectedIndex;

                return (
                    <Box
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        sx={{
                            cursor: "pointer",
                            textAlign: "center",
                            opacity: isSelected ? 1 : 0.5,
                            transform: isSelected ? "scale(1.3)" : "scale(1)",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Avatar
                            src={president.image}
                            alt={president.name}
                            sx={{
                                width: isSelected ? 50 : 50,
                                height: isSelected ? 50 : 50,
                                border: isSelected ? "4px solid #1976d2" : "2px solid gray",
                                margin: "auto",
                            }}
                        />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            {president.name}
                        </Typography>
                        <Typography variant="caption">{president.year}</Typography>
                    </Box>
                );
            })}
        </Box>
    );
}
