
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
    Box, 
    Button, 
    Typography, 
    CircularProgress, 
    Alert, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getInvoices, addInvoice, updateInvoice, deleteInvoice } from '../services/invoice-service';
import type { Invoice } from '../types';
import InvoiceForm from '../components/InvoiceForm';

const InvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const fetchInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getInvoices();
            setInvoices(data);
        } catch (_err) {
            setError('Failed to fetch invoices. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleFormOpen = useCallback((invoice: Invoice | null = null) => {
        setSelectedInvoice(invoice);
        setIsFormOpen(true);
    }, []);

    const handleFormClose = useCallback(() => {
        setSelectedInvoice(null);
        setIsFormOpen(false);
    }, []);

    const handleFormSubmit = useCallback(async (invoiceData: Omit<Invoice, 'id' | 'visibleId'>) => {
        try {
            if (selectedInvoice) {
                await updateInvoice(selectedInvoice.id, invoiceData as Invoice);
            } else {
                await addInvoice(invoiceData);
            }
            fetchInvoices();
            handleFormClose();
        } catch (_err) {
            setError('Failed to save invoice.');
        }
    }, [fetchInvoices, handleFormClose, selectedInvoice]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            await deleteInvoice(id);
            fetchInvoices();
        } catch (_err) {
            setError('Failed to delete invoice.');
        }
    }, [fetchInvoices]);

    const invoiceContent = useMemo(() => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }

        if (invoices.length === 0) {
            return (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No invoices found.</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => handleFormOpen()}>
                        Create New Invoice
                    </Button>
                </Box>
            );
        }

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice ID</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.visibleId}</TableCell>
                                <TableCell>{invoice.customerName}</TableCell>
                                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={invoice.status}
                                        color={invoice.status === 'paid' ? 'success' : invoice.status === 'sent' ? 'primary' : 'default'}
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button component={Link} to={`/invoices/${invoice.id}`} size="small"><VisibilityIcon /></Button>
                                    <Button onClick={() => handleFormOpen(invoice)} size="small"><EditIcon /></Button>
                                    <Button onClick={() => handleDelete(invoice.id)} size="small"><DeleteIcon /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }, [loading, error, invoices, handleDelete, handleFormOpen]);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Invoices
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleFormOpen()}>
                    Create Invoice
                </Button>
            </Box>

            {invoiceContent}

            <InvoiceForm 
                open={isFormOpen} 
                onClose={handleFormClose} 
                onSubmit={handleFormSubmit} 
                invoice={selectedInvoice} 
            />
        </Box>
    );
};

export default InvoicesPage;
