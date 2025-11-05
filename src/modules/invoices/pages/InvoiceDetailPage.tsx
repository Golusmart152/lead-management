
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getInvoice } from '../services/invoice-service';
import type { Invoice } from '../types';

const InvoiceDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchInvoice = async () => {
                try {
                    setLoading(true);
                    const data = await getInvoice(id);
                    setInvoice(data);
                } catch (error) {
                    console.error('Failed to fetch invoice', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchInvoice();
        }
    }, [id]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    if (!invoice) {
        return <Typography>Invoice not found</Typography>;
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Button component={Link} to="/invoices" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
                Back to Invoices
            </Button>
            <Paper sx={{ p: 4 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h4">Invoice {invoice.visibleId}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">Status: {invoice.status}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ my: 4 }}>
                    <Typography variant="h6">Customer: {invoice.customerName}</Typography>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoice.items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell align="right">{item.quantity}</TableCell>
                                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell align="right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <Typography variant="h5">Total: ${invoice.amount.toFixed(2)}</Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default InvoiceDetailPage;
