
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
    getAllFollowUps,
    updateFollowUp,
    deleteFollowUp
} from '../services/lead-service';
import type { FollowUp, FollowUpWithLead } from '../../../services/db-service';
import { useNotification } from '../../notifications/useNotification';
import EditFollowUpModal from '../components/EditFollowUpModal';
import { Edit, Delete, CheckCircle } from '@mui/icons-material';

const ScheduledTasksPage: React.FC = () => {
    const [followUps, setFollowUps] = useState<FollowUpWithLead[]>([]);
    const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchFollowUps();
    }, []);

    const fetchFollowUps = async () => {
        const allFollowUps = await getAllFollowUps();
        setFollowUps(allFollowUps as FollowUpWithLead[]);
    };

    const handleMarkAsCompleted = async (id: string) => {
        await updateFollowUp(id, { status: 'Completed' } as Partial<FollowUp>);
        fetchFollowUps();
        showNotification('Task marked as completed!', 'success');
    };

    const handleDeleteFollowUp = async (id: string) => {
        await deleteFollowUp(id);
        fetchFollowUps();
        showNotification('Task deleted successfully!', 'success');
    }

    const handleOpenEditModal = (followUp: FollowUp) => {
        setSelectedFollowUp(followUp);
        setIsEditModalOpen(true);
    }

    const handleCloseEditModal = () => {
        setSelectedFollowUp(null);
        setIsEditModalOpen(false);
    }

    const handleUpdateFollowUp = async (followUp: FollowUp) => {
        await updateFollowUp(followUp.id, followUp);
        fetchFollowUps();
    }

    const columns: GridColDef[] = [
        { field: 'clientName', headerName: 'Client Name', flex: 1.5, minWidth: 150 },
        { field: 'clientPhone', headerName: 'Client Phone', flex: 1.5, minWidth: 150 },
        { field: 'taskType', headerName: 'Task Type', flex: 1.5, minWidth: 150 },
        { field: 'notes', headerName: 'Notes', flex: 2, minWidth: 200 },
        { field: 'date', headerName: 'Due Date', flex: 1, minWidth: 120 },
        { field: 'time', headerName: 'Time', flex: 1, minWidth: 100 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 120,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography
                    sx={{
                        color: params.value === 'Pending' ? 'orange' : 'green',
                        fontWeight: 'bold'
                    }}
                >
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 1.5,
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleOpenEditModal(params.row as FollowUp)}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteFollowUp(params.row.id)}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Mark as Completed">
                        <span>
                            <IconButton 
                                onClick={() => handleMarkAsCompleted(params.row.id)}
                                disabled={params.row.status === 'Completed'}
                            >
                                <CheckCircle />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                Scheduled Tasks
            </Typography>
            <Box sx={{ height: '70vh', width: '100%' }}>
                <DataGrid
                    rows={followUps}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    sx={{ 
                        border: 0,
                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                    }}
                />
            </Box>
            <EditFollowUpModal 
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                followUp={selectedFollowUp as FollowUp}
                onUpdate={handleUpdateFollowUp}
            />
        </Box>
    );
};

export default ScheduledTasksPage;
