import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const SupportPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Support Page</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Support Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This page will provide support information.</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SupportPage;
