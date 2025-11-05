
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    Alert, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Chip 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getProjects, addProject, updateProject, deleteProject } from '../services/project-service';
import type { Project } from '../types';
import ProjectForm from '../components/ProjectForm';

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError('Failed to fetch projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleFormOpen = (project: Project | null = null) => {
        setSelectedProject(project);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setSelectedProject(null);
        setIsFormOpen(false);
    };

    const handleFormSubmit = async (projectData: Omit<Project, 'id'>) => {
        try {
            if (selectedProject) {
                await updateProject(selectedProject.id, projectData as Project);
            } else {
                await addProject(projectData);
            }
            fetchProjects();
            handleFormClose();
        } catch (err) {
            setError('Failed to save project.');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
            fetchProjects();
        } catch (err) {
            setError('Failed to delete project.');
        }
    };
    
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

    const projectContent = useMemo(() => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }

        if (projects.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No projects found.</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => handleFormOpen()}>
                        Create New Project
                    </Button>
                </Box>
            );
        }

        return (
            <Grid container spacing={3}>
                {projects.map((project) => (
                    <Grid item xs={12} sm={6} md={4} key={project.id}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{project.name}</Typography>
                                <Chip label={project.status} color={getStatusChipColor(project.status)} size="small" sx={{ mt: 1 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button component={Link} to={`/projects/${project.id}`}><ArrowForwardIcon /></Button>
                                <Button onClick={() => handleFormOpen(project)}><EditIcon /></Button>
                                <Button onClick={() => handleDelete(project.id)}><DeleteIcon /></Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }, [loading, error, projects]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Projects
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleFormOpen()}>
                    Create Project
                </Button>
            </Box>

            {projectContent}

            <ProjectForm 
                open={isFormOpen} 
                onClose={handleFormClose} 
                onSubmit={handleFormSubmit} 
                project={selectedProject} 
            />
        </Box>
    );
};

export default ProjectsPage;
