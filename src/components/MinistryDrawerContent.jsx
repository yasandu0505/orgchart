import { Box, Typography, Stack, Button, Divider } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import colors from '../assets/colors';

const MinistryDrawerContent = ({ selectedCard, selectedDate, onDepartmentClick }) => {
    if (!selectedCard) return null;

    return (
        <Box
            sx={{
                p: 3,
                backgroundColor: "none",
                mt: -5,

            }}
        >
            {/* Date */}
            <Typography
                variant="subtitle2"
                sx={{ color: 'text.secondary', mb: 0.5 }}
            >
                Gazette Date
            </Typography>
            <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
                {selectedDate}
            </Typography>

            {/* Ministry Name */}
            <Box display="flex" alignItems="center" mb={2}>
                <ApartmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedCard.title}
                </Typography>
            </Box>

            {/* Ministers */}
            <Stack spacing={1} mb={2}>
                {selectedCard.headMinister && (
                    <Box display="flex" alignItems="center">
                        <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                            <strong>Minister:</strong> {selectedCard.headMinister}
                        </Typography>
                    </Box>
                )}
                {selectedCard.deputyMinister && (
                    <Typography variant="body2" sx={{ pl: 4 }}>
                        <strong>Deputy:</strong> {selectedCard.deputyMinister}
                    </Typography>
                )}
                {selectedCard.stateMinister && (
                    <Typography variant="body2" sx={{ pl: 4 }}>
                        <strong>State:</strong> {selectedCard.stateMinister}
                    </Typography>
                )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Departments */}
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                Departments
            </Typography>
            <Stack spacing={1}>
                {selectedCard.departments?.map((dep, idx) => (
                    <Button
                        key={idx}
                        variant="contained"
                        size="small"
                        sx={{
                            justifyContent: 'flex-start',
                            backgroundColor: colors.buttonLight || '#e3f2fd',
                            color: 'primary.main',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#bbdefb',
                            },
                            fontWeight: 500,
                        }}
                        fullWidth
                        onClick={() => onDepartmentClick(dep)}
                    >
                        <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                        {dep.name}
                    </Button>
                ))}
            </Stack>
        </Box>
    );
};

export default MinistryDrawerContent;
