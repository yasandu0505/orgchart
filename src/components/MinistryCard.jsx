// src/components/MinistryCard.jsx

import { Card, Typography, Box, Stack, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import colors from '../assets/colors';

const MinistryCard = ({ card, onClick }) => {
    return (
        <Card
            sx={{
                p: 2,
                cursor: 'pointer',
                boxShadow: 3,
                borderLeft: `5px solid ${colors.backgroundSecondary}`,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6, borderLeftColor: colors.backgroundSecondary },
                backgroundColor: '#f9f9fc',
            }}
            onClick={() => onClick(card)}
        >
            <Stack spacing={1}>
                {/* Title with icon */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: colors.backgroundSecondary, width: 28, height: 28 }}>
                        <GroupsIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                        {card.title}
                    </Typography>
                </Stack>

                {/* Ministers */}
                <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon sx={{ color: colors.backgroundSecondary }} fontSize="small" />
                    <Typography variant="body2">
                        <strong>Minister:</strong> {card.headMinister || '—'}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon sx={{ color: colors.backgroundSecondary }} fontSize="small" />
                    <Typography variant="body2">
                        <strong>Deputy:</strong> {card.deputyMinister || '—'}
                    </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <PersonIcon sx={{ color: colors.backgroundSecondary }} fontSize="small" />
                    <Typography variant="body2">
                        <strong>State:</strong> {card.stateMinister || '—'}
                    </Typography>
                </Stack>
            </Stack>
        </Card>
    );
};

export default MinistryCard;
