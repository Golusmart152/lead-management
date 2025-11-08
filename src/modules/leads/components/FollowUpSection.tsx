
import React, { useState, useEffect } from 'react';
import type { FollowUp } from '../../../services/db-service';
import { getFollowUps } from '../../../services/db-service';
import FollowUpForm from './FollowUpForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';

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
        <Card className="mt-6">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Follow-Ups</CardTitle>
                <CardDescription>Track and manage follow-up activities for this lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {followUps.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No follow-ups yet. Add your first follow-up below.</p>
                ) : (
                    <div className="space-y-4">
                        {followUps.map((followUp, index) => (
                            <React.Fragment key={followUp.id}>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="space-y-1">
                                        <p className="font-medium">{followUp.notes}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Due: {new Date(followUp.dueDate).toLocaleDateString()} - Status: {followUp.status}
                                        </p>
                                    </div>
                                </div>
                                {index < followUps.length - 1 && <Separator className="my-4" />}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <FollowUpForm leadId={leadId} onFollowUpAdded={handleFollowUpAdded} />
            </CardContent>
        </Card>
    );
};

export default FollowUpSection;
