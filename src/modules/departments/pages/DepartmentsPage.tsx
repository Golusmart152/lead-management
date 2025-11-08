
import React, { useState, useEffect } from 'react';
import { getDepartments, addDepartment } from '../services/department-service';
import type { Department } from '../../employees/types';
import AddNewItemModal from '../../../components/AddNewItemModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';

const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const fetchDepartments = async () => {
        const departments = await getDepartments();
        setDepartments(departments);
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = async (name: string) => {
        await addDepartment({ name });
        fetchDepartments();
        setModalOpen(false);
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Manage Departments</h1>
                    <p className="text-muted-foreground mt-1">Add and manage organizational departments</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </Button>
            </div>

            {/* Department List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Departments</CardTitle>
                    <CardDescription>Manage your organization's departments</CardDescription>
                </CardHeader>
                <CardContent>
                    {departments.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No departments yet. Add your first department to get started.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {departments.map((department) => (
                                <li
                                    key={department.id}
                                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200"
                                >
                                    <span className="font-medium">{department.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <AddNewItemModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddDepartment}
                itemName="Department"
            />
        </div>
    );
};

export default DepartmentsPage;
