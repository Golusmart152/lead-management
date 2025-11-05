
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Modal, 
    TextField, 
    Typography, 
    useMediaQuery, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl,
    IconButton,
    Tab,
    Tabs
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getLeads, createLead, updateLead, deleteLead } from '../../../services/db-service';
import type { Lead, LeadStatus } from '../../../services/db-service';
import EditLeadModal from '../components/EditLeadModal';
import FollowUpModal from '../components/FollowUpModal';
import ScheduledTasksPage from './ScheduledTasksPage';
import { Edit, Delete, AddComment } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const leadStatuses: LeadStatus[] = [
    'New',
    'Contacted',
    'Follow-Up Scheduled',
    'Interested',
    'Not Interested',
    'Callback Requested',
    'In Progress / Under Discussion',
    'Converted / Closed-Won',
    'Lost / Closed-Lost',
    'Disqualified',
];

const LeadsListPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<Lead[]>([]);
    const [newLead, setNewLead] = useState<Omit<Lead, 'id' | 'uuid' | 'visibleId'>>({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
    });
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const leads = await getLeads();
        setRows(leads);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewLead({ ...newLead, [name as string]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setNewLead({ ...newLead, [name]: value as LeadStatus });
    };

    const handleAddLead = async () => {
        await createLead(newLead);
        fetchLeads();
        handleClose();
        setNewLead({ name: '', email: '', phone: '', company: '', status: 'New' });
    };

    const handleEditLead = (lead: Lead) => {
        setEditingLead(lead);
        setIsEditModalOpen(true);
    };

    const handleUpdateLead = async (lead: Lead) => {
        await updateLead(lead.id, lead);
        fetchLeads();
    };

    const handleDeleteLead = async (id: string) => {
        await deleteLead(id);
        fetchLeads();
    };

    const handleFollowUp = (lead: Lead) => {
        setSelectedLead(lead);
        setIsFollowUpModalOpen(true);
    };

    const handleFollowUpAdded = () => {
        fetchLeads();
        setIsFollowUpModalOpen(false);
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };
    
    const columns: GridColDef[] = [
        {
            field: 'visibleId',
            headerName: 'ID',
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Button variant="text" onClick={() => navigate(`/leads/${params.row.id}`)}>
                    {params.value}
                </Button>
            ),
        },
        { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150 },
        { field: 'email', headerName: 'Email', flex: 2, minWidth: 200 },
        { field: 'phone', headerName: 'Phone', flex: 1.5, minWidth: 150 },
        { field: 'company', headerName: 'Company', flex: 1.5, minWidth: 150 },
        { field: 'status', headerName: 'Status', flex: 1, minWidth: 120 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            flex: 1.5,
            minWidth: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => handleEditLead(params.row as Lead)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLead(params.id as string)}>
                        <Delete />
                    </IconButton>
                    <IconButton onClick={() => handleFollowUp(params.row as Lead)}>
                        <AddComment />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="leads and scheduled tasks tabs">
                    <Tab label="Leads" />
                    <Tab label="Scheduled Tasks" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
                        <Typography variant="h4" gutterBottom sx={{ flexGrow: 1 }}>
                            Leads Management
                        </Typography>
                        <Button variant="contained" onClick={handleOpen} fullWidth={isMobile}>
                            Create New Lead
                        </Button>
                    </Box>
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={modalStyle}>
                        <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
                            Create New Lead
                        </Typography>
                        <TextField margin="normal" required fullWidth label="Name" name="name" autoFocus value={newLead.name} onChange={handleInputChange} />
                        <TextField margin="normal" required fullWidth label="Email" name="email" value={newLead.email} onChange={handleInputChange} />
                        <TextField margin="normal" fullWidth label="Phone" name="phone" value={newLead.phone} onChange={handleInputChange} />
                        <TextField margin="normal" fullWidth label="Company" name="company" value={newLead.company} onChange={handleInputChange} />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select name="status" value={newLead.status} label="Status" onChange={handleSelectChange}>
                                {leadStatuses.map(status => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }} onClick={handleAddLead}>
                            Add Lead
                        </Button>
                        </Box>
                    </Modal>
                    <EditLeadModal 
                        open={isEditModalOpen} 
                        onClose={() => setIsEditModalOpen(false)} 
                        lead={editingLead} 
                        onUpdate={handleUpdateLead} 
                    />
                    <FollowUpModal
                        open={isFollowUpModalOpen}
                        onClose={() => setIsFollowUpModalOpen(false)}
                        lead={selectedLead}
                        onFollowUpAdded={handleFollowUpAdded}
                    />
                    <Box sx={{ height: '70vh', width: '100%' }}>
                        <DataGrid
                            rows={rows}
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
                </>
            )}
            {tabValue === 1 && (
                <ScheduledTasksPage />
            )}
        </Box>
    );
};

export default LeadsListPage;
