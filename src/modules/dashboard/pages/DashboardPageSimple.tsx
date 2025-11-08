import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Users,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  Grid,
  List
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { LeadCard } from '../components/LeadCard';
import { TaskCard } from '../components/TaskCard';
import { ToggleButtons } from '../components/ToggleButtons';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

// Mock data for demonstration
const mockLeads = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Tech Solutions Inc',
    email: 'john@techsolutions.com',
    phone: '+1 (555) 123-4567',
    value: 25000,
    status: 'hot' as const,
    source: 'Website',
    location: 'San Francisco, CA',
    lastContact: '2 hours ago'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Design Studio Co',
    email: 'sarah@designstudio.com',
    phone: '+1 (555) 987-6543',
    value: 18000,
    status: 'qualified' as const,
    source: 'Referral',
    location: 'New York, NY',
    lastContact: '1 day ago'
  }
];

const mockCustomers = [
  {
    id: '1',
    name: 'Emily Davis',
    email: 'emily@globalcorp.com',
    phone: '+1 (555) 111-2222',
    company: 'Global Corp',
    location: 'Seattle, WA',
    totalSpent: 45000,
    lastPurchase: '2 weeks ago',
    lifetimeValue: 45000,
    satisfactionScore: 95,
    tier: 'gold' as const,
    purchases: 12
  }
];

const mockTasks = [
  {
    id: '1',
    title: 'Follow up with Tech Solutions',
    description: 'Schedule meeting to discuss proposal details',
    priority: 'high' as const,
    status: 'pending' as const,
    assignee: 'You',
    dueDate: 'Tomorrow',
    estimatedHours: 2,
    actualHours: 0,
    tags: ['Follow-up', 'Proposal'],
    relatedLead: 'John Smith',
    createdAt: '2 days ago'
  }
];

interface DashboardStats {
  totalLeads: number;
  totalCustomers: number;
  totalTasks: number;
  conversionRate: string;
  avgDealSize: string;
}

const DashboardPageSimple: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate dashboard statistics
  const stats: DashboardStats = useMemo(() => {
    const totalLeads = mockLeads.length;
    const totalCustomers = mockCustomers.length;
    const totalTasks = mockTasks.length;
    const totalValue = mockLeads.reduce((sum, lead) => sum + lead.value, 0);
    const avgDealSize = totalLeads > 0 ? `$${(totalValue / totalLeads).toLocaleString()}` : '$0';
    const conversionRate = totalLeads > 0 ? '18.5%' : '0%';

    return {
      totalLeads,
      totalCustomers,
      totalTasks,
      conversionRate,
      avgDealSize
    };
  }, []);

  const handleStatusChange = (taskId: string, newStatus: string) => {
    console.log(`Task ${taskId} status changed to: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your leads, customers, and tasks efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <DashboardCard className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +12%
                </Badge>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </DashboardCard>

          <DashboardCard className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +8%
                </Badge>
              </div>
              <Target className="h-8 w-8 text-emerald-500" />
            </div>
          </DashboardCard>

          <DashboardCard className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
                <Badge variant="outline" className="text-orange-600 border-orange-200 mt-1">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  -3%
                </Badge>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </DashboardCard>

          <DashboardCard className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.conversionRate}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +2.1%
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </DashboardCard>

          <DashboardCard className="p-4" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Deal Size</p>
                <p className="text-2xl font-bold">{stats.avgDealSize}</p>
                <Badge variant="outline" className="text-green-600 border-green-200 mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  +5.3%
                </Badge>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </DashboardCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <DashboardCard>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                
                <div>
                  <p className="text-sm font-medium mb-2">Status</p>
                  <ToggleButtons
                    type="multiple"
                    values={['hot', 'warm', 'cold', 'qualified']}
                    selectedValues={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as string[])}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Priority</p>
                  <ToggleButtons
                    type="multiple"
                    values={['low', 'medium', 'high', 'urgent']}
                    selectedValues={selectedPriority}
                    onValueChange={(value) => setSelectedPriority(value as string[])}
                  />
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Hot Leads</h3>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockLeads.filter(lead => lead.status === 'hot').map((lead) => (
                    <div key={lead.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                          <p className="text-xs font-medium text-green-600 mt-1">${lead.value.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <DashboardCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Featured Lead</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'list' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {mockLeads.length > 0 && (
                  <LeadCard
                    lead={mockLeads[0]}
                    onContact={() => console.log('Contact lead')}
                    onViewDetails={() => console.log('View details')}
                  />
                )}
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Top Customers</h3>
                <div className="space-y-3">
                  {mockCustomers.slice(0, 3).map((customer) => (
                    <div key={customer.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{customer.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{customer.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium">${customer.totalSpent.toLocaleString()}</p>
                        <Badge variant="outline" className="text-xs">
                          {customer.tier}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <DashboardCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Task Management</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={(status) => handleStatusChange(task.id, status)}
                      onViewDetails={() => console.log('View task details')}
                    />
                  ))}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search leads..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Lead
                </Button>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageSimple;