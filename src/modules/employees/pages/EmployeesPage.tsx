
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../services/employee-service';
import type { Employee } from '../types';
import EmployeeForm from '../components/EmployeeForm';
import EmployeesTable from '../components/EmployeesTable';
import { useNotification } from '../../notifications/useNotification';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Plus, Search, Users } from 'lucide-react';

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const { showNotification } = useNotification();

    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const fetchedEmployees = await getEmployees();
            setEmployees(fetchedEmployees);
        } catch (error) {
            console.error("Error fetching employees:", error);
            showNotification('Error fetching employees', 'error');
        }
        setLoading(false);
    }, [showNotification]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setFormOpen(true);
    };

    const handleEditEmployee = (employee: Employee) => {
        setEditingEmployee(employee);
        setFormOpen(true);
    };

    const handleDeleteConfirmation = (employee: Employee) => {
        setEmployeeToDelete(employee);
    };

    const handleDeleteEmployee = async () => {
        if (!employeeToDelete) return;

        try {
            await deleteEmployee(employeeToDelete.id);
            fetchEmployees();
            showNotification('Employee deleted successfully', 'success');
        } catch (error) {
            console.error("Error deleting employee:", error);
            showNotification('Error deleting employee', 'error');
        }
        setEmployeeToDelete(null);
    };

    const handleFormSubmit = async (data: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => {
        try {
            if (editingEmployee) {
                await updateEmployee(editingEmployee.id, data as Employee);
                showNotification('Employee updated successfully', 'success');
            } else {
                await addEmployee(data as Omit<Employee, 'id' | 'uuid' | 'visibleId'>);
                showNotification('Employee added successfully', 'success');
            }
            fetchEmployees();
        } catch (error) {
            console.error("Error saving employee:", error);
            showNotification('Error saving employee', 'error');
        }
        setFormOpen(false);
    };

    const filteredEmployees = useMemo(() =>
        employees.filter(employee =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [employees, searchTerm]
    );

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        Employees
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage your organization's employee records</p>
                </div>
                <Button onClick={handleAddEmployee}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Employee
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Directory</CardTitle>
                        <CardDescription>
                            {filteredEmployees.length} of {employees.length} employees
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EmployeesTable
                            employees={filteredEmployees}
                            onEdit={handleEditEmployee}
                            onDelete={handleDeleteConfirmation}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Employee Form */}
            <EmployeeForm
                open={isFormOpen}
                onClose={() => setFormOpen(false)}
                onSubmit={handleFormSubmit}
                employee={editingEmployee}
            />

            {/* Delete Confirmation */}
            <Dialog open={!!employeeToDelete} onOpenChange={(open) => !open && setEmployeeToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Employee</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {employeeToDelete?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEmployeeToDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteEmployee}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeesPage;
