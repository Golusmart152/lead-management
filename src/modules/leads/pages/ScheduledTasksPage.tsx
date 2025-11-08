import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Edit, Delete, CheckCircle, Calendar, Clock, User, Phone, FileText, Search, ChevronUp, ChevronDown } from 'lucide-react';
import {
  getAllFollowUps,
  updateFollowUp,
  deleteFollowUp
} from '../services/lead-service';
import type { FollowUp, FollowUpWithLead } from '../../../services/db-service';
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
import { TableSkeleton } from '../../../components/ui/table-skeleton';
import EditFollowUpModal from '../components/EditFollowUpModal';

const ScheduledTasksPage: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUpWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; followUp: FollowUp | null }>({ isOpen: false, followUp: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof FollowUpWithLead; direction: 'asc' | 'desc' }>({ key: 'date', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { showNotification } = useNotification();
  const { toast } = useToast();

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    try {
      const allFollowUps = await getAllFollowUps();
      setFollowUps(allFollowUps as FollowUpWithLead[]);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
      showNotification('Error fetching scheduled tasks', 'error');
      toast({
        title: "Error",
        description: "Failed to load scheduled tasks. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [showNotification, toast]);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const handleMarkAsCompleted = useCallback(async (id: string) => {
    try {
      await updateFollowUp(id, { status: 'Completed' } as Partial<FollowUp>);
      fetchFollowUps();
      showNotification('Task marked as completed!', 'success');
      toast({
        title: "Task Completed",
        description: "The scheduled task has been marked as completed.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating follow-up:", error);
      showNotification('Error updating task', 'error');
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchFollowUps, showNotification, toast]);

  const handleDeleteFollowUp = useCallback(async (id: string) => {
    try {
      await deleteFollowUp(id);
      fetchFollowUps();
      showNotification('Task deleted successfully!', 'success');
      toast({
        title: "Task Deleted",
        description: "The scheduled task has been successfully removed.",
        variant: "default",
      });
      setDeleteConfirmation({ isOpen: false, followUp: null });
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      showNotification('Error deleting task', 'error');
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchFollowUps, showNotification, toast]);

  const handleOpenEditModal = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedFollowUp(null);
    setIsEditModalOpen(false);
  };

  const handleUpdateFollowUp = async (followUp: FollowUp) => {
    try {
      await updateFollowUp(followUp.id, followUp);
      fetchFollowUps();
      handleCloseEditModal();
      showNotification('Task updated successfully!', 'success');
      toast({
        title: "Task Updated",
        description: "The scheduled task has been successfully updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating follow-up:", error);
      showNotification('Error updating task', 'error');
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirmation = (followUp: FollowUp) => {
    setDeleteConfirmation({ isOpen: true, followUp });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.followUp) {
      handleDeleteFollowUp(deleteConfirmation.followUp.id);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, followUp: null });
  };

  // Filter and sort follow-ups
  const filteredAndSortedFollowUps = useMemo(() => {
    let filtered = followUps.filter(followUp => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (followUp.clientName && followUp.clientName.toLowerCase().includes(searchLower)) ||
        (followUp.clientPhone && followUp.clientPhone.includes(searchTerm)) ||
        (followUp.taskType && followUp.taskType.toLowerCase().includes(searchLower)) ||
        (followUp.notes && followUp.notes.toLowerCase().includes(searchLower));
      
      const matchesStatus = statusFilter === 'all' || followUp.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key] || '';
      let bValue = b[sortConfig.key] || '';
      
      // Handle date sorting
      if (sortConfig.key === 'date') {
        const dateA = new Date(aValue as string);
        const dateB = new Date(bValue as string);
        aValue = isNaN(dateA.getTime()) ? '' : dateA.toISOString();
        bValue = isNaN(dateB.getTime()) ? '' : dateB.toISOString();
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [followUps, searchTerm, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedFollowUps.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedFollowUps = filteredAndSortedFollowUps.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof FollowUpWithLead) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof FollowUpWithLead) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const isCompleted = status === 'Completed';
    return (
      <Badge 
        variant={isCompleted ? "default" : "secondary"}
        className={isCompleted 
          ? "bg-green-100 text-green-800 border-green-200" 
          : "bg-orange-100 text-orange-800 border-orange-200"
        }
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
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
          <div className="h-6 w-32 bg-muted rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
            <TableSkeleton rows={5} columns={6} />
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
            <Calendar className="h-8 w-8 text-primary" />
            Scheduled Tasks
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your follow-up tasks and scheduled activities
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {followUps.length} total tasks
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{followUps.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {followUps.filter(f => f.status !== 'Completed').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {followUps.filter(f => f.status === 'Completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold">{filteredAndSortedFollowUps.length}</p>
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
                  <Calendar className="h-5 w-5" />
                  Task Schedule
                </CardTitle>
                <CardDescription>
                  View and manage all scheduled follow-up tasks
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAndSortedFollowUps.length} of {followUps.length} tasks
              </Badge>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks by client name, phone, type, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm min-w-[120px]"
                title="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedFollowUps.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No scheduled tasks found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {followUps.length === 0 
                  ? "No scheduled tasks in the system."
                  : "Try adjusting your search criteria or filters."
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
                        onClick={() => handleSort('clientName')}
                      >
                        <div className="flex items-center gap-2">
                          Client Name
                          {getSortIcon('clientName')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('clientPhone')}
                      >
                        <div className="flex items-center gap-2">
                          Phone
                          {getSortIcon('clientPhone')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('taskType')}
                      >
                        <div className="flex items-center gap-2">
                          Task Type
                          {getSortIcon('taskType')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('date')}
                      >
                        <div className="flex items-center gap-2">
                          Due Date
                          {getSortIcon('date')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('time')}
                      >
                        <div className="flex items-center gap-2">
                          Time
                          {getSortIcon('time')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFollowUps.map((followUp) => (
                      <TableRow
                        key={followUp.id}
                        className="group transition-all duration-200 ease-in-out hover:bg-muted/50 hover:shadow-sm hover:-translate-y-0.5 border-l-2 border-transparent hover:border-l-primary/20"
                      >
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium group-hover:text-primary transition-colors duration-200">{followUp.clientName}</div>
                              <div className="text-sm text-muted-foreground">ID: {followUp.id.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <a
                              href={`tel:${followUp.clientPhone}`}
                              className="hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                            >
                              {followUp.clientPhone}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <span className="group-hover:text-primary transition-colors duration-200">{followUp.taskType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <span className="group-hover:text-primary transition-colors duration-200">
                              {followUp.date ? formatDate(followUp.date) : 'Not set'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <span className="group-hover:text-primary transition-colors duration-200">
                              {followUp.time || 'Not set'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="transition-all duration-200">
                          <div className="transform transition-all duration-200">
                            {getStatusBadge(followUp.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditModal(followUp)}
                              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
                              title="Edit Task"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteConfirmation(followUp)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
                              title="Delete Task"
                            >
                              <Delete className="h-4 w-4" />
                            </Button>
                            {followUp.status !== 'Completed' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsCompleted(followUp.id)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 transition-all duration-200 hover:scale-110"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
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
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedFollowUps.length)} of {filteredAndSortedFollowUps.length} results
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
                    title="Number of tasks per page"
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

      {/* Edit Modal */}
      <EditFollowUpModal 
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        followUp={selectedFollowUp as FollowUp}
        onUpdate={handleUpdateFollowUp}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scheduled Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledTasksPage;
