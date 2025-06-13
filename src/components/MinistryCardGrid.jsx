// src/components/MinistryCardGrid.jsx

import { Box, Grid, Typography } from '@mui/material';
import MinistryCard from './MinistryCard';
import colors from '../assets/colors';

const MinistryCardGrid = ({ selectedPresident, selectedDate, onCardClick }) => {
    if (!selectedPresident || !selectedDate) return null;

    const dateEntry = selectedPresident.dates.find(d => d.date === selectedDate);
    if (!dateEntry || !Array.isArray(dateEntry.ministerList)) return null;

    const ministryCards = dateEntry.ministerList.map((minister, index) => ({
        id: index,
        title: minister.name,
        headMinister: minister.headMinister,
        deputyMinister: minister.deputyMinister,
        stateMinister: minister.stateMinister,
        departments: minister.departments,
    }));

    return (
        <Box sx={{ px: 4, pb: 4 }}>
            <Box sx={{ p: 3, overflowX: 'auto' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        Gazette Date
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.textSecondary}}>
                        {selectedDate}
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    {ministryCards.map((card) => (
                        <Grid key={card.id} item xs={12} sm={6} md={4}>
                            <MinistryCard card={card} onClick={onCardClick} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default MinistryCardGrid;
