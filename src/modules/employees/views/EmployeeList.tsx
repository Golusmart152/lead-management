
import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { motion } from 'framer-motion';
import type { Employee } from '../types';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employee-service';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getEmployees();
            setEmployees(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleAddClick = () => {
        setSelectedEmployee(null);
        setFormOpen(true);
    };

    const handleEditClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setFormOpen(true);
    };

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setConfirmDialogOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedEmployee(null);
    };

    const handleFormSubmit = async (formData: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => {
        try {
            if ('id' in formData) {
                await updateEmployee(formData.id, formData);
            } else {
                await addEmployee(formData);
            }
            fetchEmployees();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
        } finally {
            handleFormClose();
        }
    };

    const handleDeleteConfirm = async () => {
        if (employeeToDelete) {
            try {
                await deleteEmployee(employeeToDelete.id);
                fetchEmployees();
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
                setError(errorMessage);
            } finally {
                setEmployeeToDelete(null);
                setConfirmDialogOpen(false);
            }
        }
    };

    const columns: GridColDef<Employee>[] = [
        { field: 'visibleId', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        {
            field: 'role',
            headerName: 'Role',
            width: 150,
            valueGetter: (_, row) => row.role.name,
        },
        {
            field: 'department',
            headerName: 'Department',
            width: 180,
            valueGetter: (_, row) => row.department.name,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box>
                    <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(params.row as Employee)} color="primary">
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClick(params.row as Employee)} color="secondary">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Employee Management
                    </Typography>
                    <Box>
                        <Tooltip title="Refresh Data">
                            <IconButton onClick={fetchEmployees} color="primary">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                            sx={{ ml: 2, borderRadius: 2, boxShadow: '0 3px 5px 2px rgba(0, 105, 255, .3)' }}
                        >
                            Add Employee
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={employees}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { pageSize: 10, page: 0 }
                                }
                            }}
                            pageSizeOptions={[5, 10, 25]}
                            rowHeight={60}
                            sx={{
                                '& .MuiDataGrid-columnHeaders': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    fontSize: '1rem',
                                },
                                '& .MuiDataGrid-cell': {
                                    fontSize: '0.95rem',
                                },
                                '& .MuiDataGrid-footerContainer': {
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                },
                            }}
                        />
                    </Box>
                )}

                <EmployeeForm
                    open={isFormOpen}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    employee={selectedEmployee}
                />

                <ConfirmationDialog
                    open={isConfirmDialogOpen}
                    onClose={() => setConfirmDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Confirm Deletion"
                    description={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
                />
            </Paper>
        </motion.div>
    );
};

export default EmployeeList;
