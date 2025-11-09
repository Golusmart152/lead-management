import React, { useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { ChevronDown, ChevronUp, MoreHorizontal, Mail, Phone } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileTableProps<T extends { id: string }> {
  data: T[];
  columns: {
    key: keyof T | 'actions';
    title: string;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    className?: string;
  }[];
  isLoading?: boolean;
  emptyMessage?: string;
}

const statusStyles = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/20'
};

export function MobileTable<T extends { id: string; email?: string; phone?: string; avatar?: string; status?: string }>({ data, columns, isLoading = false, emptyMessage = "No data available" }: MobileTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} variant="glass" className="overflow-hidden">
            <CardContent className="p-0">
              <div className="animate-pulse p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  // Display first column as main title, others as details
  const primaryColumn = columns[0];
  const detailColumns = columns.slice(1);

  return (
    <div className="space-y-4 md:hidden">
      {data.map((item) => {
        const isExpanded = expandedRows.has(item.id);
        const primaryValue = item[primaryColumn.key as keyof T];
        const primaryContent = primaryColumn.render
          ? primaryColumn.render(primaryValue, item)
          : primaryValue as React.ReactNode;

        return (
          <Card key={item.id} variant="glass" className="overflow-hidden" interactive>
            <CardContent spacing="none" className="p-0">
              {/* Main Row */}
              <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/20 transition-colors"
                onClick={() => toggleRow(item.id)}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {item.avatar ? (
                      <img src={item.avatar} alt={String(primaryValue)} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      String(primaryValue).split(' ').map(n => n[0]).join('').substring(0, 2)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">
                      {primaryContent}
                    </div>
                    {item.email && (
                      <div className="text-sm text-gray-400 truncate flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {item.email}
                      </div>
                    )}
                    {item.phone && (
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {item.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  {item.status && (
                    <Badge
                      className={cn(
                        "text-xs border",
                        statusStyles[item.status as keyof typeof statusStyles] || statusStyles.pending
                      )}
                    >
                      {item.status}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-gray-700/50 bg-gray-800/20">
                  <div className="p-4 space-y-4">
                    {detailColumns.map((column) => {
                       if (column.key === 'actions') {
                        return column.render ? column.render(item, item) : null;
                      }
                      const value = item[column.key as keyof T];
                      if (!value) return null;
                      
                      return (
                        <div key={column.key as string} className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-400 w-1/3 truncate flex items-center gap-2">
                            {column.title}:
                          </span>
                          <div className="flex-1 text-right">
                            {column.render
                              ? column.render(value, item)
                              : (
                                <span className="text-sm text-gray-300">
                                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                                </span>
                              )
                            }
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        Delete
                      </Button>
                      <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-gray-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
