import React, { useState, useEffect } from 'react';
import { Edit, Save, Trash2, X, User, UserCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Lead, LeadStatus } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

const editLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost']),
});

type EditLeadFormData = z.infer<typeof editLeadSchema>;

interface EditLeadModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
  onUpdate: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const leadStatuses: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'unqualified',
  'proposal',
  'negotiation',
  'won',
  'lost',
];

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

const EditLeadModal: React.FC<EditLeadModalProps> = ({ open, onClose, lead, onUpdate, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<EditLeadFormData>({
    resolver: zodResolver(editLeadSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'new',
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status,
      });
    }
  }, [lead, form]);

  const onSubmit = async (data: EditLeadFormData) => {
    if (!lead) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedLead: Lead = {
        ...lead,
        ...data,
        phone: data.phone || undefined,
        company: data.company || undefined,
      };
      
      onUpdate(updatedLead);
      onClose();
    } catch (error) {
      console.error('Failed to update lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (lead) {
      onDelete(lead.id);
      onClose();
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Edit className="h-6 w-6" />
                Edit Lead
              </DialogTitle>
              <DialogDescription>
                Update the lead information below
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(form.watch('status'))}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Enter full name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="Enter email address"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="Enter phone number"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    {...form.register('company')}
                    placeholder="Enter company name"
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Lead Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5" />
                Lead Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Lead Status *</Label>
                <Select 
                  value={form.watch('status')} 
                  onValueChange={(value) => form.setValue('status', value as LeadStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead status" />
                  </SelectTrigger>
                  <SelectContent>
                    {leadStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(status).split(' ')[0].replace('bg-', 'bg-')}`} />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
            {!showDeleteConfirm ? (
              <Button 
                type="button" 
                variant="destructive" 
                disabled={isLoading}
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Lead
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={isLoading}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  disabled={isLoading}
                  onClick={handleDelete}
                  className="flex-1"
                >
                  Confirm Delete
                </Button>
              </div>
            )}

            <div className="flex gap-3 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeadModal;