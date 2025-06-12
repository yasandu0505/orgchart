import { Box, Button, Card, Stack, TextField, Grid, Typography, Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PresidencyTimeline from './PresidencyTimeline';
import colors from '../assets/colors';
import { useSelector } from 'react-redux';
import { presidents } from '../presidents';
import { useState } from 'react';

const OrgChart = () => {
    const { selectedIndex, selectedDate } = useSelector((state) => state.presidency);
    const selectedPresident = selectedIndex !== null ? presidents[selectedIndex] : null;

    const [view, setView] = useState('');
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


    const ministryCards = (() => {
        if (!selectedPresident || !selectedDate) return [];

        const dateEntry = selectedPresident.dates.find(d => d.date === selectedDate);
        if (!dateEntry || !Array.isArray(dateEntry.ministerList)) return [];

        return dateEntry.ministerList.map((minister, index) => ({
            id: index,
            title: minister.name,
            headMinister: minister.headMinister,
            deputyMinister: minister.deputyMinister,
            stateMinister: minister.stateMinister,
            departments: minister.departments,
        }));
    })();

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

            <Box sx={{ display: "flex" }}>
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

            {/* Card Grid for Modern View */}
            {view === 'modern' && selectedDate != null && (
                <Box sx={{ px: 4, pb: 4 }}>
                    <Card sx={{ p: 3, overflowX: 'auto' }}>
                        {selectedDate && (
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                                    Gazette Date
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {selectedDate}
                                </Typography>
                            </Box>
                        )}

                        <Grid container spacing={2}>
                            {ministryCards.map((card) => (
                                <Grid key={card.id} item xs={12} sm={6} md={4}>
                                    <Card
                                        sx={{ p: 2, cursor: 'pointer', boxShadow: 3, '&:hover': { boxShadow: 6 } }}
                                        onClick={() => handleCardClick(card)}
                                    >
                                        <Typography variant="h6">{card.title}</Typography>
                                        <Typography variant="body2">Minister: {card.headMinister}</Typography>
                                        <Typography variant="body2">Deputy Minister: {card.deputyMinister}</Typography>
                                        <Typography variant="body2">State Minister: {card.stateMinister}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Box>
            )}

            {/* Right Drawer */}
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerClose}
            >
                <Box sx={{ width: 500, p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header with back and close buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                        }}
                    >
                        {/* Back button only in department mode */}
                        {drawerMode === 'department' ? (
                            <Button onClick={() => setDrawerMode('ministry')}>
                                ← Back
                            </Button>
                        ) : (
                            <Box width={75} /> // keeps spacing consistent when back button isn't shown
                        )}



                        {/* Close button */}
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flexGrow: 1 }}>
                        {drawerMode === 'ministry' && selectedCard && (
                            <>
                                <Typography variant="h6">{selectedDate}</Typography>
                                <Typography variant="h6" gutterBottom>{selectedCard.title}</Typography>
                                <Typography variant="body2">Minister: {selectedCard.headMinister}</Typography>
                                <Typography variant="body2">Deputy Minister: {selectedCard.deputyMinister}</Typography>
                                <Typography variant="body2" gutterBottom>State Minister: {selectedCard.stateMinister}</Typography>

                                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Departments</Typography>
                                <Stack spacing={1}>
                                    {selectedCard.departments?.map((dep, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outlined"
                                            size="small"
                                            sx={{ justifyContent: 'flex-start' }}
                                            fullWidth
                                            onClick={() => handleDepartmentClick(dep)}
                                        >
                                            {dep.name}
                                        </Button>
                                    ))}
                                </Stack>
                            </>
                        )}

                        {drawerMode === 'department' && selectedDepartment && (
                            <>
                                <Typography variant="h6">{selectedDepartment.name}</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    More details about the department can go here.
                                </Typography>
                            </>
                        )}
                    </Box>
                </Box>
            </Drawer>

        </Box>
    );
};

export default OrgChart;