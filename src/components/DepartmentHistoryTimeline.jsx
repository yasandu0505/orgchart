import { useState } from 'react';
import {Typography,Paper,Avatar,} from '@mui/material';
import colors from '../assets/colors';
import {Timeline,TimelineItem,TimelineOppositeContent,TimelineSeparator,TimelineDot,TimelineConnector,TimelineContent,} from '@mui/lab';

const DepartmentHistoryTimeline = ({ selectedDepartment }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const toggleSelect = (idx) => {
        setSelectedIndex(selectedIndex === idx ? null : idx);
    };
    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                {selectedDepartment.name}
            </Typography>

            {selectedDepartment.history && selectedDepartment.history.length > 0 ? (
                <Timeline position="alternate" sx={{ py: 0 }}>
                    {selectedDepartment.history
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((entry, idx, arr) => (
                            <TimelineItem
                                key={idx}
                                sx={{
                                    '&:hover': { backgroundColor: '#f5f5f5', borderRadius: 2 },
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    py: 0.5,
                                }}
                            >
                                <TimelineOppositeContent
                                    sx={{
                                        m: 'auto 0',
                                        color: 'text.secondary',
                                        fontWeight: '600',
                                        fontSize: 12,
                                        minWidth: 70,
                                        pr: 1,
                                    }}
                                    align="right"
                                    variant="body2"
                                >
                                    {new Date(entry.date).toLocaleDateString()}
                                </TimelineOppositeContent>

                                <TimelineSeparator>
                                    <TimelineDot
                                        color="primary"
                                        sx={{
                                            width: 2,
                                            height: 2,
                                            boxShadow: `0 0 6px rgba(25, 118, 210, 0.7)`,
                                            animation: 'pulse 2.5s infinite',
                                            backgroundColor: colors.backgroundSecondary,
                                            background: `linear-gradient(45deg,${colors.dotColorActive}, #21cbf3)`,
                                        }}
                                    />
                                    {idx < arr.length - 1 && (
                                        <TimelineConnector sx={{ bgcolor: colors.timelineLineActive, height: 2 }} />
                                    )}
                                </TimelineSeparator>

                                <TimelineContent sx={{ py: 0.5, px: 1 }}>
                                    <Paper
                                        elevation={3}
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            backgroundColor: selectedIndex === idx ? 'primary.light' : 'background.paper',
                                            boxShadow: selectedIndex === idx
                                                ? '0 0 10px rgba(25, 118, 210, 0.4)'
                                                : '0 1px 5px rgba(0,0,0,0.1)',
                                            transform: selectedIndex === idx ? 'scale(1.02)' : 'scale(1)',
                                            transition: 'all 0.2s ease-in-out',
                                        }}
                                        onClick={() => toggleSelect(idx)}
                                    >

                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: colors.backgroundSecondary, width: 30, height: 30, fontSize: 14 }}>
                                                {entry.minister ? entry.minister.charAt(0).toUpperCase() : '?'}
                                            </Avatar>
                                            <div style={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: '700', fontSize: 14 }}>
                                                    {entry.minister}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ fontSize: 12 }}
                                                >
                                                    {entry.headMinister}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Paper>

                                </TimelineContent>
                            </TimelineItem>
                        ))}
                </Timeline>
            ) : (
                <Typography variant="body2" sx={{ mt: 2 }}>
                    No timeline history available.
                </Typography>
            )}

            <style>
                {`
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
            }
            70% {
              box-shadow: 0 0 0 8px rgba(33, 150, 243, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
            }
          }
        `}
            </style>
        </>
    );
};

export default DepartmentHistoryTimeline;
