import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Building2, Users, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '../services/customer-service';
import type { Customer } from '../types';
import CustomerForm from '../components/CustomerForm';
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
  DialogTrigger,
} from '../../../components/ui/dialog';
import { TableSkeleton } from '../../../components/ui/table-skeleton';

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Customer; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showNotification } = useNotification();
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers as Customer[]);
    } catch (error) {
      console.error("Error fetching customers:", error);
      showNotification('Error fetching customers', 'error');
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [showNotification, toast]);

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

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      fetchCustomers();
      showNotification('Customer deleted successfully', 'success');
      toast({
        title: "Customer Deleted",
        description: "The customer has been successfully removed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      showNotification('Error deleting customer', 'error');
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = async (data: Omit<Customer, 'id' | 'uuid' | 'visibleId'> | Customer) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data as Customer);
        showNotification('Customer updated successfully', 'success');
        toast({
          title: "Customer Updated",
          description: "The customer information has been successfully updated.",
          variant: "default",
        });
      } else {
        await addCustomer(data as Omit<Customer, 'id' | 'uuid' | 'visibleId'>);
        showNotification('Customer added successfully', 'success');
        toast({
          title: "Customer Added",
          description: "The new customer has been successfully created.",
          variant: "default",
        });
      }
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      showNotification('Error saving customer', 'error');
      toast({
        title: "Error",
        description: "Failed to save customer. Please try again.",
        variant: "destructive",
      });
    }
    setFormOpen(false);
  };

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm || 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        (customer.phone && customer.phone.includes(searchTerm)) ||
        (customer.company && customer.company.toLowerCase().includes(searchLower));
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
  }, [customers, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedCustomers.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedCustomers = filteredAndSortedCustomers.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof Customer) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof Customer) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
          </div>
          <div className="h-10 w-32 bg-muted rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-muted rounded" />
                    <div className="h-8 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-8 w-8 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-muted rounded" />
                  <div className="h-4 w-64 bg-muted rounded" />
                </div>
                <div className="h-6 w-32 bg-muted rounded" />
              </div>
              <div className="h-10 w-full max-w-sm bg-muted rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={5} columns={4} />
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
            <Users className="h-8 w-8 text-primary" />
            Customers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your customer relationships and information
          </p>
        </div>
        <Button onClick={handleAddCustomer} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Companies</p>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.company).length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredAndSortedCustomers.length}</p>
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
                  <Users className="h-5 w-5" />
                  Customer List
                </CardTitle>
                <CardDescription>
                  Manage your customer database and relationships
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAndSortedCustomers.length} of {customers.length} customers
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No customers found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {customers.length === 0 
                  ? "Get started by adding your first customer."
                  : "Try adjusting your search criteria."
                }
              </p>
              {customers.length === 0 && (
                <Button onClick={handleAddCustomer}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Customer
                </Button>
              )}
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
                        onClick={() => handleSort('company')}
                      >
                        <div className="flex items-center gap-2">
                          Company
                          {getSortIcon('company')}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCustomers.map((customer) => (
                      <TableRow
                        key={customer.id}
                        className="group transition-all duration-200 ease-in-out hover:bg-muted/50 hover:shadow-sm hover:-translate-y-0.5 border-l-2 border-transparent hover:border-l-primary/20"
                      >
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                              <span className="text-sm font-semibold text-primary">
                                {customer.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-primary transition-colors duration-200">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">ID: {customer.visibleId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <a
                              href={`mailto:${customer.email}`}
                              className="text-primary hover:underline transition-colors duration-200 hover:scale-105 transform"
                            >
                              {customer.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          {customer.phone ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                                <Phone className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <a
                                href={`tel:${customer.phone}`}
                                className="hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                              >
                                {customer.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          {customer.company ? (
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                                <Building2 className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <span className="group-hover:text-primary transition-colors duration-200">{customer.company}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCustomer(customer)}
                              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="transition-all duration-300 scale-100">
                                <DialogHeader>
                                  <DialogTitle>Delete Customer</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete {customer.name}? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button variant="outline">
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
                                  >
                                    Delete Customer
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedCustomers.length)} of {filteredAndSortedCustomers.length} results
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
                    title="Number of customers per page"
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

      {/* Customer Form */}
      <CustomerForm
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        customer={editingCustomer}
      />
    </div>
  );
};

export default CustomerPage;
