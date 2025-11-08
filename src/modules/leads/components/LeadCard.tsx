
import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Mail, Building2, Phone } from 'lucide-react';
import type { Lead } from '../types/Lead';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface LeadCardProps {
    lead: Lead;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        marginBottom: '8px',
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'new': 'bg-blue-100 text-blue-800 border-blue-200',
            'contacted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'qualified': 'bg-purple-100 text-purple-800 border-purple-200',
            'proposal': 'bg-orange-100 text-orange-800 border-orange-200',
            'closed-won': 'bg-green-100 text-green-800 border-green-200',
            'closed-lost': 'bg-red-100 text-red-800 border-red-200',
        };
        return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="group cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-2 border-transparent hover:border-l-primary/20 hover:bg-muted/30 bg-background/80 backdrop-blur-sm"
        >
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/10 to-primary/20 border-2 border-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 transition-all duration-200">
                            <AvatarFallback className="text-primary font-semibold text-sm">
                                {lead.name?.charAt(0)?.toUpperCase() || 'L'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                {lead.name || 'Unknown Lead'}
                            </h3>
                            {lead.company && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                    <Building2 className="h-3 w-3 flex-shrink-0" />
                                    {lead.company}
                                </p>
                            )}
                        </div>
                    </div>
                    <Badge variant="outline" className={`text-xs shrink-0 ${getStatusColor(lead.status)}`}>
                        {lead.status?.replace('-', ' ') || 'new'}
                    </Badge>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                    {lead.email && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-muted/50 rounded flex items-center justify-center flex-shrink-0">
                                <Mail className="h-2.5 w-2.5 text-muted-foreground" />
                            </div>
                            <a
                                href={`mailto:${lead.email}`}
                                className="text-primary hover:underline transition-colors duration-200 truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {lead.email}
                            </a>
                        </div>
                    )}
                    
                    {lead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 bg-muted/50 rounded flex items-center justify-center flex-shrink-0">
                                <Phone className="h-2.5 w-2.5 text-muted-foreground" />
                            </div>
                            <a
                                href={`tel:${lead.phone}`}
                                className="hover:text-primary transition-colors duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {lead.phone}
                            </a>
                        </div>
                    )}
                    
                </div>

                {/* Touch-friendly interaction area */}
                <div className="mt-3 pt-2 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="text-xs text-muted-foreground text-center">
                        Tap and drag to move
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LeadCard;
