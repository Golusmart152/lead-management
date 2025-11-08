import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AddNewItemModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    itemName: string;
}

const AddNewItemModal: React.FC<AddNewItemModalProps> = ({ open, onClose, onSave, itemName }) => {
    const [name, setName] = useState('');

    const handleSave = () => {
        onSave(name);
        setName('');
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New {itemName}</DialogTitle>
                    <DialogDescription>
                        Enter the name for your new {itemName.toLowerCase()}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                            Name
                        </label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                            placeholder={`${itemName} Name`}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={handleSave}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddNewItemModal;
