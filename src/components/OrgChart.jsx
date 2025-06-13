import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import PresidencyTimeline from './PresidencyTimeline';
import colors from '../assets/colors';
import { useSelector } from 'react-redux';
import { presidents } from '../presidents';
import { useState } from 'react';
import InfoTab from './InfoTab';
import MinistryCardGrid from './MinistryCardGrid';


const OrgChart = () => {
    const { selectedIndex, selectedDate } = useSelector((state) => state.presidency);
    const selectedPresident = selectedIndex !== null ? presidents[selectedIndex] : null;

    const [view, setView] = useState('modern');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [drawerMode, setDrawerMode] = useState('ministry');
    const [selectedDepartment, setSelectedDepartment] = useState(null);


    const handleViewChange = (type) => {
        setView(type);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setDrawerMode('ministry');
        setSelectedDepartment(null);
        setDrawerOpen(true);
    };


    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedCard(null);
        setDrawerMode('ministry');
        setSelectedDepartment(null);
    };

    const handleDepartmentClick = (dep) => {
        setSelectedDepartment(dep);
        setDrawerMode('department');
    };

    return (
        <Box
            sx={{
                width: '100vw',
                minHeight: '100vh',
                backgroundColor: colors.backgroundPrimary,
                overflowX: 'hidden',
            }}
        >
            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, p: 2, justifyContent: 'center' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{
                        input: { color: colors.textSearch },
                        label: { color: colors.textSearch },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#1565c0' },
                            '&:hover fieldset': { borderColor: colors.textSearch },
                            '&.Mui-focused fieldset': { borderColor: colors.textSearch },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    sx={{
                        minWidth: 120,
                        height: '40px',
                        fontWeight: 600,
                        backgroundColor: colors.textSearch,
                        color: '#fff',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#1565c0' },
                    }}
                >
                    Search
                </Button>
            </Box>


{/* View Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, px: 2 }}>
                <Stack direction="row" spacing={3}>
                    <Button
                        variant={view === 'classic' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleViewChange('classic')}
                    >
                        Classic
                    </Button>
                    <Button
                        variant={view === 'modern' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleViewChange('modern')}
                    >
                        Modern
                    </Button>
                    <Button
                        variant={view === 'compare' ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => handleViewChange('compare')}
                    >
                        Compare
                    </Button>
                </Stack>
            </Box>
            <Box sx={{ display: "flex" , mt: 5}}>
                <PresidencyTimeline />
            </Box>

            {/* Selected Info Card */}
            <Box sx={{ padding: 2, textAlign: 'center' }}>
                <Card sx={{ m: 2 }}>
                    <Box sx={{ padding: 2 }}>
                        {selectedPresident && (
                            <>
                                <Typography>{selectedPresident.name}</Typography>
                                <Typography>Term: {selectedPresident.year}</Typography>
                            </>
                        )}
                    </Box>
                </Card>
            </Box>

            

            {/* Card Grid for Modern View */}
            {view === 'modern' && selectedDate != null && (
                <MinistryCardGrid
                    selectedPresident={selectedPresident}
                    selectedDate={selectedDate}
                    onCardClick={handleCardClick}
                />

            )}

            {/* Right Drawer */}
            <InfoTab
                drawerOpen={drawerOpen}
                drawerMode={drawerMode}
                selectedCard={selectedCard}
                selectedDepartment={selectedDepartment}
                selectedDate={selectedDate}
                onClose={handleDrawerClose}
                onBack={() => setDrawerMode('ministry')}
                onDepartmentClick={handleDepartmentClick}
            />

        </Box>
    );
};

export default OrgChart;