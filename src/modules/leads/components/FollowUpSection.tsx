
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Paper
} from '@mui/material';
import type { FollowUp } from '../../../services/db-service';
import { getFollowUps } from '../../../services/db-service';
import FollowUpForm from './FollowUpForm';

interface FollowUpSectionProps {
    leadId: string;
}

const FollowUpSection: React.FC<FollowUpSectionProps> = ({ leadId }) => {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);

    useEffect(() => {
        if (leadId) {
            getFollowUps(leadId).then(setFollowUps);
        }
    }, [leadId]);

    const handleFollowUpAdded = (newFollowUp: FollowUp) => {
        setFollowUps([...followUps, newFollowUp]);
    };

    return (
        <Paper sx={{ p: { xs: 2, md: 4 }, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Follow-Ups
            </Typography>
            <List>
                {followUps.map((followUp, index) => (
                    <React.Fragment key={followUp.id}>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary={followUp.notes}
                                secondary={`Due: ${new Date(followUp.dueDate).toLocaleDateString()} - Status: ${followUp.status}`}
                            />
                        </ListItem>
                        {index < followUps.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                ))}
            </List>
            <FollowUpForm leadId={leadId} onFollowUpAdded={handleFollowUpAdded} />
        </Paper>
    );
};

export default FollowUpSection;
