import React, { useState } from 'react';
import {
  Search,
  Plus,
  MoreVertical,
  Users,
  Target,
  TrendingUp,
  ArrowUpRight,
  Bell,
  Settings
} from 'lucide-react';
import { DashboardCard } from '../components/DashboardCard';
import { LeadCard } from '../components/LeadCard';
import { ToggleButtons } from '../components/ToggleButtons';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';

// Mock data for demonstration - keeping only essential leads
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

interface DashboardStats {
  totalLeads: number;
  conversionRate: string;
  avgDealSize: string;
}

const DashboardPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate dashboard statistics
  const stats: DashboardStats = React.useMemo(() => {
    const totalLeads = mockLeads.length;
    const totalValue = mockLeads.reduce((sum, lead) => sum + lead.value, 0);
    const avgDealSize = totalLeads > 0 ? `$${(totalValue / totalLeads).toLocaleString()}` : '$0';
    const conversionRate = totalLeads > 0 ? '18.5%' : '0%';

    return {
      totalLeads,
      conversionRate,
      avgDealSize
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-[1600px] mx-auto space-y-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lead Management Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your leads efficiently</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Main Content Layout */}
        <div className="flex gap-8 overflow-x-auto">
          {/* Left Column - Filters and Search */}
          <div className="flex-shrink-0 w-[320px] space-y-16">
            {/* Filters Card */}
            <DashboardCard>
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Filters</h3>

                <div>
                  <p className="text-sm font-medium mb-2">Lead Status</p>
                  <ToggleButtons
                    type="multiple"
                    values={['hot', 'warm', 'cold', 'qualified']}
                    selectedValues={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value as string[])}
                  />
                </div>
              </div>
            </DashboardCard>

            {/* Search and Quick Actions */}
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

          {/* Right Column - Leads Display */}
          <div className="flex-1 space-y-16">
            {/* Hot Leads */}
            <DashboardCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Hot Leads</h3>
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {mockLeads.filter(lead => lead.status === 'hot').map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onContact={() => console.log('Contact lead')}
                      onViewDetails={() => console.log('View lead details')}
                    />
                  ))}
                </div>
              </div>
            </DashboardCard>

            {/* All Leads */}
            <DashboardCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">All Leads</h3>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {mockLeads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onContact={() => console.log('Contact lead')}
                      onViewDetails={() => console.log('View lead details')}
                    />
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;