import {
    Box,
    Button,
    Card,
    Stack,
    TextField,
    Grid,
    Typography,
    Drawer,
    IconButton
} from '@mui/material';
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

    const handleViewChange = (type) => {
        setView(type);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedCard(null);
    };

    const mockCards = Array.from({ length: 29 }).map((_, i) => ({
        id: i,
        title: `Card ${i + 1}`,
        description: `This is card number ${i + 1}`,
    }));

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

            <Box
                sx={{
                    display: "flex"
                }}
            >
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
            {view === 'modern' && (
                <Box sx={{ px: 4, pb: 4 }}>
                    <Card sx={{ p: 3, overflowX: 'auto' }}>
                         {selectedDate && <Typography>Gazette Date: {selectedDate}</Typography>}
                        <Grid container spacing={2}>
                            {mockCards.map((card) => (
                                <Grid key={card.id} item xs={12} sm={6} md={4}>
                                    <Card

                                        sx={{ p: 2, cursor: 'pointer' }}
                                        onClick={() => handleCardClick(card)}
                                    >
                                        <Typography variant="h6">{card.title}</Typography>
                                        <Typography variant="body2">{card.description}</Typography>
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
                <Box sx={{ width: 500, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">Details</Typography>
                        <IconButton onClick={handleDrawerClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    {selectedCard && (
                        <>
                            <Typography variant="subtitle1">{selectedCard.title}</Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>{selectedCard.description}</Typography>
                        </>
                    )}
                </Box>
            </Drawer>
        </Box>
    );
};

export default OrgChart;
