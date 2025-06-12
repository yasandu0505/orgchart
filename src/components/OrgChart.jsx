import { Box, Button, Card, Stack, TextField } from '@mui/material';
import PresidencyTimeline from './PresidencyTimeline';
import colors from '../assets/colors';
import { useSelector } from 'react-redux';
import { presidents } from '../presidents';


const OrgChart = () => {
    const { selectedIndex, selectedDate } = useSelector((state) => state.presidency);
    const selectedPresident = selectedIndex !== null ? presidents[selectedIndex] : null;

    
    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    minHeight: '100vh',
                    backgroundColor: colors.backgroundPrimary,
                    overflow: 'hidden',
                }}
            >

                {/* Centered search bar */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mb: 4,
                        padding: 2,
                        justifyContent: 'center',
                    }}
                >
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                            input: { color: colors.textSearch },
                            label: { color: colors.textSearch },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#1565c0',
                                },
                                '&:hover fieldset': {
                                    borderColor: colors.textSearch,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.textSearch,
                                },
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
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                        }}
                    >
                        Search
                    </Button>
                </Box>

                <PresidencyTimeline />






                {/* Centered button row */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2, padding: 2 }}>
                    <Stack direction="row" spacing={3}>
                        <Button variant="outlined" color="primary">
                            Classic
                        </Button>
                        <Button variant="outlined" color="primary">
                            Modern
                        </Button>
                        <Button variant="outlined" color="primary">
                            Compare
                        </Button>
                    </Stack>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Stack direction="row" spacing={2}>

                    </Stack>
                </Box>
                <Card>

                    <Box sx={{ padding: 2, textAlign: 'center' }}>
                        <Card sx={{ m: 2 }}>
                            <Box sx={{ padding: 2, textAlign: 'center' }}>
                                <h2>Modern View</h2>
                                {selectedPresident && (
                                    <>
                                        <p>{selectedPresident.name}</p>
                                        <p>Term: {selectedPresident.year}</p>
                                    </>

                                )}

                                {selectedDate && <p>Gazette Date: {selectedDate}</p>}
                            </Box>
                        </Card>

                    </Box>
                </Card>


            </Box>


        </>
    );
};

export default OrgChart;
