
import React, { useEffect, useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import type { Employee } from '../types';
import type { Role } from '../../roles/types';
import type { Department } from '../../departments/types';
import { getRoles } from '../../roles/services/role-service';
import { getDepartments } from '../../departments/services/department-service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Users } from 'lucide-react';

interface EmployeeFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: Omit<Employee, 'id' | 'uuid' | 'visibleId'> | Employee) => void;
    employee: Employee | null;
}

// Use a dedicated type for form data to handle relationships with IDs
type EmployeeFormData = {
    name: string;
    email: string;
    phone: string;
    roleId: string;
    departmentId: string;
};

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<EmployeeFormData>({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            roleId: '',
            departmentId: '',
        }
    });

    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMetadata = async () => {
            setLoading(true);
            try {
                const [rolesResult, departmentsResult] = await Promise.allSettled([
                    getRoles(),
                    getDepartments(),
                ]);

                const rolesData = rolesResult.status === 'fulfilled' ? rolesResult.value : [];
                const departmentsData = departmentsResult.status === 'fulfilled' ? departmentsResult.value : [];
                
                setRoles(rolesData);
                setDepartments(departmentsData);

                if (employee) {
                    reset({
                        name: employee.name,
                        email: employee.email,
                        phone: employee.phone || '',
                        roleId: employee.role.id,
                        departmentId: employee.department.id,
                    });
                } else {
                    reset({
                        name: '',
                        email: '',
                        phone: '',
                        roleId: rolesData[0]?.id || '',
                        departmentId: departmentsData[0]?.id || '',
                    });
                }
            } catch (error) {
                console.error("Failed to fetch metadata", error);
            } finally {
                setLoading(false);
            }
        };
        if (open) {
            fetchMetadata();
        }
    }, [employee, open, reset]);

    const handleFormSubmit: SubmitHandler<EmployeeFormData> = (data) => {
        const selectedRole = roles.find(r => r.id === data.roleId);
        const selectedDepartment = departments.find(d => d.id === data.departmentId);

        if (!selectedRole || !selectedDepartment) {
            console.error("Selected role or department not found");
            return;
        }

        const submissionData = {
            ...(employee || {}),
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: selectedRole,
            department: selectedDepartment,
        };

        onSubmit(submissionData as Employee);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {employee ? 'Edit Employee' : 'Add Employee'}
                    </DialogTitle>
                    <DialogDescription>
                        {employee ? 'Update employee information.' : 'Create a new employee profile.'}
                    </DialogDescription>
                </DialogHeader>
                
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Name is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Employee name"
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                )}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' }
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            className={errors.email ? 'border-destructive' : ''}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="phone"
                                            placeholder="Phone number"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleId">Role *</Label>
                                <Controller
                                    name="roleId"
                                    control={control}
                                    rules={{ required: 'Role is required' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.roleId ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.roleId && (
                                    <p className="text-sm text-destructive">{errors.roleId.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="departmentId">Department *</Label>
                                <Controller
                                    name="departmentId"
                                    control={control}
                                    rules={{ required: 'Department is required' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className={errors.departmentId ? 'border-destructive' : ''}>
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.departmentId && (
                                    <p className="text-sm text-destructive">{errors.departmentId.message}</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {employee ? 'Save Changes' : 'Add Employee'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default EmployeeForm;
