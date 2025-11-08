import * as React from 'react';
import { cn } from '../../lib/utils';
import { ScrollArea } from './scroll-area';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  layout?: 'auto' | 'fixed';
  variant?: 'default' | 'striped' | 'compact';
  interactive?: boolean;
  className?: string;
}

const TableRoot = React.forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, layout = 'auto', variant = 'default', interactive = true, ...props }, ref) => {
    const layoutClass = layout === 'fixed' ? 'table-fixed' : 'table-auto';
    const variantClass = variant === 'striped' ? 'ds-table-striped' : variant === 'compact' ? 'ds-table-compact' : '';
    
    return (
      <div
        ref={ref}
        className={cn(
          'ds-table rounded-xl border border-gray-700/50 overflow-hidden',
          variantClass,
          className
        )}
        {...props}
      >
        <ScrollArea>
          <table className={cn('w-full caption-bottom text-sm', layoutClass)}>
            {children}
          </table>
        </ScrollArea>
      </div>
    );
  }
);
TableRoot.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        'bg-gray-800/50 border-b border-gray-700/50',
        className
      )}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(
        '[&_tr:last-child]:border-0',
        className
      )}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'border-t border-gray-700/50 bg-gray-800/30 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  state?: 'selected' | 'active' | 'inactive';
  interactive?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, state, interactive = true, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-gray-700/50 transition-colors',
        interactive && 'hover:bg-gray-700/30 cursor-pointer',
        state === 'selected' && 'bg-blue-500/10 border-blue-500/30',
        state === 'active' && 'bg-gray-700/30',
        'data-[state=selected]:bg-blue-500/10',
        className
      )}
      data-state={state}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sortable, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-12 px-4 text-left align-middle font-semibold text-gray-300',
        'text-sm border-b border-gray-700/50',
        sortable && 'cursor-pointer hover:text-white select-none transition-colors',
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        'p-4 align-middle text-sm text-gray-300',
        'border-b border-gray-700/50',
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-gray-400', className)}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';

// Specialized header cells
interface TableColumnHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableColumnHeaderCell = React.forwardRef<HTMLTableCellElement, TableColumnHeaderCellProps>(
  ({ className, ...props }, ref) => (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-semibold text-gray-300 text-sm border-b border-gray-700/50',
        className
      )}
      scope="col"
      ref={ref}
      {...props}
    />
  )
);
TableColumnHeaderCell.displayName = 'TableColumnHeaderCell';

interface TableRowHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableRowHeaderCell = React.forwardRef<HTMLTableCellElement, TableRowHeaderCellProps>(
  ({ className, ...props }, ref) => (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-semibold text-gray-300 text-sm border-b border-gray-700/50',
        className
      )}
      scope="row"
      ref={ref}
      {...props}
    />
  )
);
TableRowHeaderCell.displayName = 'TableRowHeaderCell';

// Advanced table components
interface DataTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    header: string;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
    className?: string;
  }[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
  variant?: 'default' | 'striped' | 'compact';
}

function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  className,
  onRowClick,
  variant = 'default'
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="ds-spinner"></div>
      </div>
    );
  }

  return (
    <TableRoot className={className} variant={variant}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={String(column.key)}
              className={column.className}
              style={{ width: column.width }}
              sortable={column.sortable}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8 text-gray-400">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, index) => (
            <TableRow
              key={index}
              interactive={!!onRowClick}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.cell ? column.cell(item) : String(item[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </TableRoot>
  );
}

// Export all components
export {
  TableRoot as Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableColumnHeaderCell,
  TableRowHeaderCell,
  DataTable,
};

// Export types
export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableHeadProps,
  TableRowProps,
  TableCellProps,
  TableCaptionProps,
  TableColumnHeaderCellProps,
  TableRowHeaderCellProps,
  DataTableProps,
};