
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    Button,
    Chip,
    Tabs,
    Tab
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getProject, deleteProject } from '../services/project-service';
import type { Project } from '../types';
import ProjectForm from '../components/ProjectForm';

const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    setLoading(true);
                    const data = await getProject(id);
                    setProject(data);
                } catch (error) {
                    console.error('Failed to fetch project', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [id]);

    const handleFormOpen = () => {
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        if (id) {
            getProject(id).then(setProject);
        }
    };

    const handleDeleteProject = async () => {
        if (project) {
            if (window.confirm(`Are you sure you want to delete project: ${project.name}?`)) {
                try {
                    await deleteProject(project.id);
                    navigate('/projects');
                } catch (error) {
                    console.error("Failed to delete project", error);
                }
            }
        }
    };
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    if (!project) {
        return <Typography>Project not found</Typography>;
    }
    
    const getStatusChipColor = (status: string) => {
        switch (status) {
            case 'not started': return 'default';
            case 'in progress': return 'primary';
            case 'completed': return 'success';
            case 'on hold': return 'warning';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} sx={{ mb: 2 }}>
                Back to Projects
            </Button>
            <Paper sx={{ p: 4, mb: 4 }}>
                <Grid container justifyContent="space-between" alignItems="flex-start">
                    <Grid item>
                        <Typography variant="h4" gutterBottom>{project.name}</Typography>
                         <Chip 
                            label={project.status} 
                            color={getStatusChipColor(project.status)}
                            size="small"
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="outlined" startIcon={<EditIcon />} onClick={handleFormOpen} sx={{ mr: 1 }}>
                            Edit
                        </Button>
                        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteProject}>
                            Delete
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="body1" sx={{ my: 2 }}>{project.description}</Typography>
                 <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                        <Typography variant="body1">{new Date(project.startDate).toLocaleDateString()}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1">{new Date(project.endDate).toLocaleDateString()}</Typography>
                    </Grid>
                </Grid>
            </Paper>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={currentTab} onChange={handleTabChange} aria-label="project detail tabs">
                    <Tab label="Tasks" />
                    <Tab label="Milestones" />
                    <Tab label="Files" />
                </Tabs>
            </Box>
             <Box sx={{ pt: 3 }}>
                {currentTab === 0 && (
                    <Typography>Tasks will be displayed here.</Typography>
                )}
                {currentTab === 1 && (
                     <Typography>Milestones will be displayed here.</Typography>
                )}
                 {currentTab === 2 && (
                     <Typography>Files will be displayed here.</Typography>
                )}
            </Box>

            {isFormOpen && (
                <ProjectForm
                    open={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={async (projectData) => {
                        handleFormClose();
                    }}
                    project={project}
                />
            )}
        </Box>
    );
};

export default ProjectDetailPage;
