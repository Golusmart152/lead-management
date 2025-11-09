
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Users, Search, Target, Building2, TrendingUp } from 'lucide-react';
import { getLeads, createLead, updateLead, deleteLead } from '../../../services/db-service';
import type { Lead } from '../../../services/db-service';
import LeadForm from '../components/LeadForm';
import LeadsTable from '../components/LeadsTable';
import { useNotification } from '../../notifications/useNotification';
import { useToast } from '../../../hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  TableSkeleton
} from '../../../components/ui/table-skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; lead: Lead | null }>({ isOpen: false, lead: null });
  const { showNotification } = useNotification();
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedLeads = await getLeads();
      setLeads(fetchedLeads as Lead[]);
    } catch (error) {
      console.error("Error fetching leads:", error);
      showNotification('Error fetching leads', 'error');
      toast({
        title: "Error",
        description: "Failed to load leads. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [showNotification, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleAddLead = () => {
    setEditingLead(null);
    setFormOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setFormOpen(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      fetchLeads();
      showNotification('Lead deleted successfully', 'success');
      toast({
        title: "Lead Deleted",
        description: "The lead has been successfully removed.",
        variant: "default",
      });
      setDeleteConfirmation({ isOpen: false, lead: null });
    } catch (error) {
      console.error("Error deleting lead:", error);
      showNotification('Error deleting lead', 'error');
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirmation = (lead: Lead) => {
    setDeleteConfirmation({ isOpen: true, lead });
  };

  const confirmDelete = () => {
    if (deleteConfirmation.lead) {
      handleDeleteLead(deleteConfirmation.lead.id);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, lead: null });
  };

  const handleFormSubmit = async (data: Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead) => {
    try {
      if (editingLead) {
        await updateLead(editingLead.id, data as Lead);
        showNotification('Lead updated successfully', 'success');
        toast({
          title: "Lead Updated",
          description: "The lead information has been successfully updated.",
          variant: "default",
        });
      } else {
        await createLead(data as Omit<Lead, 'id' | 'uuid' | 'visibleId'>);
        showNotification('Lead added successfully', 'success');
        toast({
          title: "Lead Created",
          description: "The new lead has been successfully created.",
          variant: "default",
        });
      }
      fetchLeads();
    } catch (error) {
      console.error("Error saving lead:", error);
      showNotification('Error saving lead', 'error');
      toast({
        title: "Error",
        description: "Failed to save lead. Please try again.",
        variant: "destructive",
      });
    }
    setFormOpen(false);
  };

  // Filter and sort leads
  const filteredAndSortedLeads = useMemo(() => {
    const filtered = leads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      return !searchTerm ||
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        (lead.phone && lead.phone.includes(searchTerm)) ||
        (lead.company && lead.company.toLowerCase().includes(searchLower)) ||
        lead.status.toLowerCase().includes(searchLower);
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
  }, [leads, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedLeads.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedLeads = filteredAndSortedLeads.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: keyof Lead) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
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
            <Target className="h-8 w-8 text-primary" />
            Leads
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your sales pipeline and track potential customers
          </p>
        </div>
        <Button onClick={handleAddLead} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Leads</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.status === 'new').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">With Companies</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.company).length}
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
                <p className="text-sm text-muted-foreground">Qualified Leads</p>
                <p className="text-2xl font-bold">
                  {leads.filter(l => l.status === 'qualified' || l.status === 'proposal' || l.status === 'negotiation').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
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
                  <Target className="h-5 w-5" />
                  Leads List
                </CardTitle>
                <CardDescription>
                  Manage your sales pipeline and track potential customers
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAndSortedLeads.length} of {leads.length} leads
              </Badge>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search leads by name, email, phone, company, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredAndSortedLeads.length === 0 ? (
            <div className="text-center py-12">
              <Target className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-xl font-semibold">No leads found</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                {leads.length === 0
                  ? "Get started by adding your first lead."
                  : "Try adjusting your search criteria."
                }
              </p>
              {leads.length === 0 && (
                <Button onClick={handleAddLead}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Lead
                </Button>
              )}
            </div>
          ) : (
            <>
              <LeadsTable
                leads={paginatedLeads}
                onEdit={handleEditLead}
                onDelete={handleDeleteConfirmation}
                sortConfig={sortConfig}
                onSort={handleSort}
              />

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAndSortedLeads.length)} of {filteredAndSortedLeads.length} results
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
                    title="Number of leads per page"
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

      {/* Lead Form */}
      <LeadForm
        open={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        lead={editingLead}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={cancelDelete}>
        <DialogContent className="transition-all duration-300 scale-100">
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deleteConfirmation.lead?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200"
            >
              Delete Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadsPage;
