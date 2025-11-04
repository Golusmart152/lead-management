import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Grid, 
    Modal, 
    TextField, 
    Typography, 
    useMediaQuery, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl,
    IconButton,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getLeads, createLead, updateLead, deleteLead } from '../../services/db-service';
import type { Lead } from '../../services/db-service';
import EditLeadModal from './EditLeadModal';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
};

const LeadsListPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState<Lead[]>([]);
    const [newLead, setNewLead] = useState<Omit<Lead, 'id'>>({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
    });
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        setNewLead({ ...newLead, [name]: value });
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
    
    const columns: GridColDef[] = [
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
                    <IconButton onClick={() => navigate(`/leads/${params.id}`)}>
                        <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleEditLead(params.row as Lead)}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteLead(params.id as string)}>
                        <Delete />
                    </IconButton>
                </Box>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid item xs={12} sm>
              <Typography variant="h4" gutterBottom>
                Leads Management
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Button variant="contained" onClick={handleOpen} fullWidth={isMobile}>
                Create New Lead
              </Button>
            </Grid>
          </Grid>
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
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Contacted">Contacted</MenuItem>
                      <MenuItem value="Qualified">Qualified</MenuItem>
                      <MenuItem value="Lost">Lost</MenuItem>
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
        </Box>
    );
};

export default LeadsListPage;
