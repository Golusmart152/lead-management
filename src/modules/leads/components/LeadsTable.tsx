import React from 'react';
import { Edit, Trash2, Mail, Phone, Building2, User, Users, ChevronUp, ChevronDown } from 'lucide-react';
import type { Lead, LeadStatus } from '../../../services/db-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  sortConfig: { key: keyof Lead; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof Lead) => void;
}

const getStatusColor = (status: LeadStatus) => {
  const colors = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    qualified: 'bg-purple-100 text-purple-800 border-purple-200',
    unqualified: 'bg-gray-100 text-gray-800 border-gray-200',
    proposal: 'bg-orange-100 text-orange-800 border-orange-200',
    negotiation: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    won: 'bg-green-100 text-green-800 border-green-200',
    lost: 'bg-red-100 text-red-800 border-red-200',
  };
  return colors[status];
};

const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onEdit,
  onDelete,
  sortConfig,
  onSort
}) => {
  const getSortIcon = (key: keyof Lead) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">No leads found</h3>
        <p className="text-muted-foreground mt-2 mb-6">
          Get started by adding your first lead or adjust your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-2">
                Name
                {getSortIcon('name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => onSort('email')}
            >
              <div className="flex items-center gap-2">
                Email
                {getSortIcon('email')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => onSort('phone')}
            >
              <div className="flex items-center gap-2">
                Phone
                {getSortIcon('phone')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => onSort('company')}
            >
              <div className="flex items-center gap-2">
                Company
                {getSortIcon('company')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer select-none hover:bg-muted/50"
              onClick={() => onSort('status')}
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
          {leads.map((lead) => (
            <TableRow
              key={lead.id}
              className="group transition-all duration-200 ease-in-out hover:bg-muted/50 hover:shadow-sm hover:-translate-y-0.5 border-l-2 border-transparent hover:border-l-primary/20"
            >
              <TableCell className="transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium group-hover:text-primary transition-colors duration-200">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">ID: {lead.id.slice(-8)}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="transition-all duration-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-primary hover:underline transition-colors duration-200 hover:scale-105 transform"
                  >
                    {lead.email}
                  </a>
                </div>
              </TableCell>
              <TableCell className="transition-all duration-200">
                {lead.phone ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <a
                      href={`tel:${lead.phone}`}
                      className="hover:text-primary transition-colors duration-200 hover:scale-105 transform"
                    >
                      {lead.phone}
                    </a>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </TableCell>
              <TableCell className="transition-all duration-200">
                {lead.company ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted/50 rounded flex items-center justify-center">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="group-hover:text-primary transition-colors duration-200">{lead.company}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </TableCell>
              <TableCell className="transition-all duration-200">
                <Badge variant="outline" className={getStatusColor(lead.status)}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                    className="h-8 w-8 p-0 transition-all duration-200 hover:bg-primary/10 hover:scale-110"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(lead)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
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
  );
};

export default LeadsTable;