import React from 'react';
import { X, User, Mail, Phone, Building2, Calendar, Clock, UserCheck, FileText } from 'lucide-react';
import type { Lead } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

interface LeadDetailModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const getStatusColor = (status: string) => {
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
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ open, onClose, lead }) => {
  if (!lead) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">
                {lead.name}
              </DialogTitle>
              <DialogDescription>
                Lead Details and Information
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(lead.status)}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="text-sm">{lead.name}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                  <p className="text-sm">
                    <a 
                      href={`mailto:${lead.email}`}
                      className="text-primary hover:underline"
                    >
                      {lead.email}
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <p className="text-sm">
                    {lead.phone ? (
                      <a 
                        href={`tel:${lead.phone}`}
                        className="text-primary hover:underline"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    Company
                  </div>
                  <p className="text-sm">
                    {lead.company || <span className="text-muted-foreground italic">Not provided</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Lead Management Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5" />
                Lead Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Current Status
                  </div>
                  <Badge variant="outline" className={getStatusColor(lead.status)}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <UserCheck className="h-4 w-4" />
                    Assigned To
                  </div>
                  <p className="text-sm">
                    {lead.assignedTo && lead.assignedTo !== 'unassigned' ? String(lead.assignedTo) : <span className="text-muted-foreground italic">Unassigned</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* System Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Lead ID
                  </div>
                  <p className="text-sm font-mono text-xs">{String(lead.visibleId)}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    UUID
                  </div>
                  <p className="text-sm font-mono text-xs">{String(lead.uuid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes Section */}
          {lead.notes && (
            <>
              <Separator />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" />
                    Notes & Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{String(lead.notes)}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button className="w-full sm:w-auto hover:shadow-lg transition-all duration-200">
              Edit Lead
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
