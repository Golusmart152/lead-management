
import React, { useState } from 'react';
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
    FormControl 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

const initialRows = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', company: 'Acme Inc.', status: 'New' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', company: 'Beta Corp.', status: 'Contacted' },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', phone: '555-555-5555', company: 'Gamma LLC', status: 'Qualified' },
];

const LeadsListPage: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState(initialRows);
    const [newLead, setNewLead] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setNewLead({ ...newLead, [name as string]: value });
    };

    const handleAddLead = () => {
        const id = rows.length > 0 ? Math.max(...rows.map(row => row.id)) + 1 : 1;
        setRows([...rows, { ...newLead, id }]);
        handleClose();
        setNewLead({ name: '', email: '', phone: '', company: '', status: 'New' });
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
            flex: 1,
            minWidth: 100,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/leads/${params.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} alignItems="center" mb={3}>
            <Grid xs={12} sm>
              <Typography variant="h4" gutterBottom>
                Leads Management
              </Typography>
            </Grid>
            <Grid xs={12} sm="auto">
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
                  <Select name="status" value={newLead.status} label="Status" onChange={handleInputChange as any}>
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
