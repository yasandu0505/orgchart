import { Box, Button, Card, Stack, TextField } from '@mui/material';
import PresidencyTimeline from './PresidencyTimeline';

const OrgChart = () => {
    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    minHeight: '100vh',
                    backgroundColor: '#f5f5f5',
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
                            input: { color: '#0d47a1' },
                            label: { color: '#0d47a1' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#1565c0',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#0d47a1',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#0d47a1',
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
                            backgroundColor: '#0d47a1',
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
                        <h2>Modern View</h2>
                        <p>Ministers</p>
                    </Box>
                </Card>


            </Box>


        </>
    );
};

export default OrgChart;
