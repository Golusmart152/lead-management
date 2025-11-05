
import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const SettingsPage: React.FC = () => {
    const { control, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
        // Implement settings save logic here
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
                Settings
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>Profile Settings</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="fullName"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Full Name" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Controller
                                name="email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field} label="Email Address" type="email" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit">
                                Save Profile
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>Notification Settings</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="emailNotifications"
                                        control={control}
                                        defaultValue={true}
                                        render={({ field }) => <Switch {...field} checked={field.value} />}
                                    />
                                }
                                label="Email Notifications"
                            />
                        </Grid>
                         <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="pushNotifications"
                                        control={control}
                                        defaultValue={false}
                                        render={({ field }) => <Switch {...field} checked={field.value} />}
                                    />
                                }
                                label="Push Notifications"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit">
                                Save Notifications
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </form>
        </Box>
    );
};

export default SettingsPage;
