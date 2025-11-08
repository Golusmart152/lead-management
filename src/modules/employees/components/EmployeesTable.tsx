import React, { useState, useMemo } from 'react';
import { Edit, Delete, Mail, Phone, User, Building2, ChevronUp, ChevronDown, Search } from 'lucide-react';
import type { Employee } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  loading?: boolean;
}

interface SortConfig {
  key: keyof Employee | 'role.name' | 'department.name';
  direction: 'asc' | 'desc';
}

const getRoleColor = (roleName: string) => {
  const colors: Record<string, string> = {
    'Admin': 'bg-purple-100 text-purple-800 border-purple-200',
    'Manager': 'bg-blue-100 text-blue-800 border-blue-200',
    'Employee': 'bg-green-100 text-green-800 border-green-200',
    'Intern': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };
  return colors[roleName] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getDepartmentColor = (deptName: string) => {
  const colors: Record<string, string> = {
    'Sales': 'bg-red-100 text-red-800 border-red-200',
    'Marketing': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'HR': 'bg-pink-100 text-pink-800 border-pink-200',
    'Finance': 'bg-orange-100 text-orange-800 border-orange-200',
    'IT': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  };
  return colors[deptName] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onEdit, onDelete, loading = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  // Get unique roles and departments for filters
  const uniqueRoles = useMemo(() => {
    const roles = [...new Set(employees.map(emp => emp.role?.name).filter(Boolean))];
    return roles.sort();
  }, [employees]);

  const uniqueDepartments = useMemo(() => {
    const departments = [...new Set(employees.map(emp => emp.department?.name).filter(Boolean))];
    return departments.sort();
  }, [employees]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = !searchTerm ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        employee.role?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'all' || employee.role?.name === filterRole;
      const matchesDepartment = filterDepartment === 'all' || employee.department?.name === filterDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortConfig.key === 'role.name') {
        aValue = a.role?.name || '';
        bValue = b.role?.name || '';
      } else if (sortConfig.key === 'department.name') {
        aValue = a.department?.name || '';
        bValue = b.department?.name || '';
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [employees, searchTerm, filterRole, filterDepartment, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEmployees.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedEmployees = filteredAndSortedEmployees.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof Employee | 'role.name' | 'department.name') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof Employee | 'role.name' | 'department.name') => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Loading employees...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                Employees
              </CardTitle>
              <CardDescription>
                Manage your team members and their information
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredAndSortedEmployees.length} of {employees.length} employees
            </Badge>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {uniqueDepartments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAndSortedEmployees.length === 0 ? (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
            <p className="text-muted-foreground mt-2">
              {employees.length === 0 
                ? "Get started by adding your first employee."
                : "Try adjusting your search criteria."
              }
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {getSortIcon('name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center gap-2">
                        Email
                        {getSortIcon('email')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('phone')}
                    >
                      <div className="flex items-center gap-2">
                        Phone
                        {getSortIcon('phone')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('role.name')}
                    >
                      <div className="flex items-center gap-2">
                        Role
                        {getSortIcon('role.name')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer select-none hover:bg-muted/50"
                      onClick={() => handleSort('department.name')}
                    >
                      <div className="flex items-center gap-2">
                        Department
                        {getSortIcon('department.name')}
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEmployees.map((employee) => (
                    <TableRow 
                      key={employee.id}
                      className="transition-colors hover:bg-muted/50 group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {employee.visibleId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`mailto:${employee.email}`}
                            className="text-primary hover:underline transition-colors"
                          >
                            {employee.email}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={`tel:${employee.phone}`}
                            className="hover:text-primary transition-colors"
                          >
                            {employee.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(employee.role?.name || '')}>
                          {employee.role?.name || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDepartmentColor(employee.department?.name || '')}>
                          <Building2 className="h-3 w-3 mr-1" />
                          {employee.department?.name || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(employee)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(employee)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Delete className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedEmployees.length)} of {filteredAndSortedEmployees.length} results
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={pageSize.toString()} onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setPage(1);
                }}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-2 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeesTable;
