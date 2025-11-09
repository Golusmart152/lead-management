import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit, Shield, Users, Search, ChevronUp, ChevronDown, Mail } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { useNotification } from '../../notifications/useNotification';
import { useToast } from '../../../hooks/use-toast';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt?: Timestamp;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({ key: 'email', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showNotification } = useNotification();
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users: ", error);
      showNotification('Error fetching users', 'error');
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [showNotification, toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setModalOpen(false);
  };

  const handleSaveRole = async (userId: string, newRole: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
      fetchUsers();
      showNotification('User role updated successfully', 'success');
      toast({
        title: "Role Updated",
        description: "The user role has been successfully updated.",
        variant: "default",
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error updating user role: ", error);
      showNotification('Error updating user role', 'error');
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm || 
        user.email.toLowerCase().includes(searchLower) ||
        (user.name && user.name.toLowerCase().includes(searchLower)) ||
        user.role.toLowerCase().includes(searchLower);
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedUsers = filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof User) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      case 'user':
      case 'employee':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'manager':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'user':
      case 'employee':
        return 'bg-muted/10 text-muted-foreground border-muted/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-lg">Loading users...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and permissions across the system
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {users.length} total users
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Administrators</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredAndSortedUsers.length}</p>
              </div>
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  User List
                </CardTitle>
                <CardDescription>
                  Manage user roles and access permissions
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAndSortedUsers.length} of {users.length} users
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedUsers.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No users found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {users.length === 0 
                  ? "No users found in the system."
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
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center gap-2">
                          Email
                          {getSortIcon('email')}
                        </div>
                      </TableHead>
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
                        onClick={() => handleSort('role')}
                      >
                        <div className="flex items-center gap-2">
                          Role
                          {getSortIcon('role')}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow 
                        key={user.id}
                        className="transition-colors hover:bg-muted/50 group"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-primary">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{user.email}</div>
                              <div className="text-sm text-muted-foreground">ID: {user.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user.name || 'Not provided'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)} className={getRoleBadgeClass(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
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
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} results
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setPage(1);
                    }}
                    className="px-3 py-1 border rounded-md text-sm"
                    title="Number of users per page"
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
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

      {/* Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role for {editingUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role-select">Role</Label>
            <Select
              defaultValue={editingUser?.role}
              onValueChange={(value) => handleSaveRole(editingUser?.id || '', value)}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
