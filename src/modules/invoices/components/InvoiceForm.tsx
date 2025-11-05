
import React from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Invoice } from '../types';

interface InvoiceFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (invoice: Omit<Invoice, 'id' | 'visibleId'>) => void;
    invoice?: Omit<Invoice, 'id' | 'visibleId'> | null;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ open, onClose, onSubmit, invoice }) => {
    const { control, handleSubmit, watch } = useForm<Omit<Invoice, 'id' | 'visibleId'>>({
        defaultValues: invoice || {
            customerName: '',
            amount: 0,
            status: 'draft',
            items: [{ description: '', quantity: 1, price: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");

    const totalAmount = watchItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="customerName"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Customer Name" fullWidth />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => <TextField {...field} label="Status" select fullWidth SelectProps={{ native: true }}>
                                    <option value="draft">Draft</option>
                                    <option value="sent">Sent</option>
                                    <option value="paid">Paid</option>
                                </TextField>}
                            />
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="h6">Items</Typography>
                        </Grid>

                        {fields.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <Grid item xs={5}>
                                    <Controller
                                        name={`items.${index}.description`}
                                        control={control}
                                        render={({ field }) => <TextField {...field} label="Description" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Controller
                                        name={`items.${index}.quantity`}
                                        control={control}
                                        render={({ field }) => <TextField {...field} label="Quantity" type="number" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <Controller
                                        name={`items.${index}.price`}
                                        control={control}
                                        render={({ field }) => <TextField {...field} label="Price" type="number" fullWidth />}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <IconButton onClick={() => remove(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </React.Fragment>
                        ))}
                        <Grid item xs={12}>
                            <Button startIcon={<AddIcon />} onClick={() => append({ description: '', quantity: 1, price: 0 })}>
                                Add Item
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
                            <Typography variant="h5">Total: ${totalAmount.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">{invoice ? 'Save' : 'Create'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default InvoiceForm;
