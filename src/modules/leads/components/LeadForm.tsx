import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Building2, Users, FileText, Save, X } from 'lucide-react';
import type { Lead, LeadStatus } from '../types';
import { getEmployees } from '../../employees/services/employee-service';
import type { Employee } from '../../employees/types';
import { useToast } from '../../../hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost']),
  assignedTo: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (lead: Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead) => void;
  lead: Omit<Lead, 'id' | 'uuid' | 'visibleId'> | Lead | null;
}

const leadStatusOptions: LeadStatus[] = ['new', 'contacted', 'qualified', 'unqualified', 'proposal', 'negotiation', 'won', 'lost'];

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

const LeadForm: React.FC<LeadFormProps> = ({ open, onClose, onSubmit, lead }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {
      name: '',
      email: '',
      phone: '',
      status: 'new',
      assignedTo: 'unassigned',
      company: '',
      notes: '',
    },
  });

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const employeesData = await getEmployees();
        setEmployees(employeesData);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employees list.",
          variant: "destructive",
        });
      }
    }
    fetchEmployees();
  }, [toast]);

  useEffect(() => {
    if (open) {
      form.reset(lead || {
        name: '',
        email: '',
        phone: '',
        status: 'new',
        assignedTo: 'unassigned',
        company: '',
        notes: '',
      });
    }
  }, [lead, open, form]);

  const onFormSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(data);
      toast({
        title: lead ? "Lead Updated" : "Lead Created",
        description: `The lead has been successfully ${lead ? 'updated' : 'created'}.`,
        variant: "default",
      });
      onClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save the lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const currentStatus = form.watch('status');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">
                {lead ? 'Edit Lead' : 'Add New Lead'}
              </DialogTitle>
              <DialogDescription>
                {lead ? 'Update the lead information below' : 'Fill in the details to create a new lead'}
              </DialogDescription>
            </div>
            {lead && currentStatus && (
              <Badge variant="outline" className={getStatusColor(currentStatus)}>
                {currentStatus}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter full name" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Enter email address" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter phone number" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormDescription>Optional contact number</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Company
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter company name" 
                            {...field} 
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormDescription>Optional company information</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Lead Management Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Lead Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lead status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leadStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status).split(' ')[0].replace('bg-', 'bg-')}`} />
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Current stage of the lead</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Assigned To
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="unassigned">
                              <em>Unassigned</em>
                            </SelectItem>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Employee responsible for this lead</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Additional Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes & Comments</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add any additional notes or comments about this lead..."
                          className="min-h-[100px] resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Optional notes about the lead</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
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
                    {lead ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {lead ? 'Update Lead' : 'Create Lead'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadForm;
