import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Card, CardContent } from '../../../components/ui/card';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  onSave: (userId: string, newRole: string) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user, onSave }) => {
  const [role, setRole] = React.useState(user?.role || '');

  React.useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  const handleSave = () => {
    if (user && role) {
      onSave(user.id, role);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
          <DialogDescription>
            Update the role for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">User Email</Label>
                <div className="p-3 bg-muted/50 rounded-md text-sm">
                  {user.email}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-select">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!role}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
