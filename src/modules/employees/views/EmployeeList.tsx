
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Employee } from '../types';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employee-service';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Plus, Edit, Trash2, RefreshCw, Users } from 'lucide-react';

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

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-3">
                                <Users className="h-6 w-6 text-primary" />
                                Employee Management
                            </CardTitle>
                            <CardDescription>
                                Manage your organization's employee records and information
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={fetchEmployees}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button onClick={handleAddClick}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Employee
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 bg-destructive/15 border border-destructive/20 rounded-md text-destructive">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell className="font-mono text-sm">
                                                {employee.visibleId}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {employee.name}
                                            </TableCell>
                                            <TableCell>{employee.email}</TableCell>
                                            <TableCell>{employee.phone || '-'}</TableCell>
                                            <TableCell>{employee.role.name}</TableCell>
                                            <TableCell>{employee.department.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditClick(employee)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(employee)}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

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
        </motion.div>
    );
};

export default EmployeeList;
