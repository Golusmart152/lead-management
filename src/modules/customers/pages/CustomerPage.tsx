
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    IconButton, 
    TablePagination, 
    TextField, 
    InputAdornment,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customer-service';
import type { Customer } from '../types';
import CustomerForm from '../components/CustomerForm';
import { useNotification } from '../../notifications/useNotification';

const CustomerPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
    const { showNotification } = useNotification();

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedCustomers = await getCustomers();
            setCustomers(fetchedCustomers as Customer[]);
        } catch (error) {
            console.error("Error fetching customers:", error);
            showNotification('Error fetching customers', 'error');
        }
        setLoading(false);
    }, [showNotification]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleAddCustomer = () => {
        setEditingCustomer(null);
        setFormOpen(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setFormOpen(true);
    };

    const handleDeleteConfirmation = (customer: Customer) => {
        setCustomerToDelete(customer);
    };

    const handleDeleteCustomer = async () => {
        if (!customerToDelete) return;

        try {
            await deleteCustomer(customerToDelete.id);
            fetchCustomers();
            showNotification('Customer deleted successfully', 'success');
        } catch (error) {
            console.error("Error deleting customer:", error);
            showNotification('Error deleting customer', 'error');
        }
        setCustomerToDelete(null);
    };

    const handleFormSubmit = async (data: Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer) => {
        try {
            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, data as Customer);
                showNotification('Customer updated successfully', 'success');
            } else {
                await addCustomer(data as Omit<Customer, 'id' | 'uuid' | 'visibleId'>);
                showNotification('Customer added successfully', 'success');
            }
            fetchCustomers();
        } catch (error) {
            console.error("Error saving customer:", error);
            showNotification('Error saving customer', 'error');
        }
        setFormOpen(false);
    };

    const filteredCustomers = useMemo(() => 
        customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), 
        [customers, searchTerm]
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Customers</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddCustomer}
                >
                    Add Customer
                </Button>
            </Box>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            {loading ? <CircularProgress /> : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Company</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.company}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditCustomer(customer)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(customer)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredCustomers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(parseInt(event.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            )}
            <CustomerForm
                open={isFormOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                customer={editingCustomer}
            />
            <Dialog
                open={!!customerToDelete}
                onClose={() => setCustomerToDelete(null)}
            >
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete {customerToDelete?.name}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCustomerToDelete(null)}>Cancel</Button>
                    <Button onClick={handleDeleteCustomer} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CustomerPage;
