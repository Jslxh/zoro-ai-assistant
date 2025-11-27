"use client";

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Employee } from '@/services/email';
import { addEmployee, updateEmployee } from '@/services/email';
import { useToast } from '@/hooks/use-toast';

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  employee?: Employee | null;
  onSuccess?: () => void;
}

export function EmployeeFormDialog2({ isOpen, setIsOpen, employee, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setRole(employee.role || '');
      setDepartment(employee.department || '');
    } else if (isOpen) {
      setName('');
      setEmail('');
      setRole('');
      setDepartment('');
    }
  }, [employee, isOpen]);

  const close = () => setIsOpen(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !role.trim() || !department.trim()) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all fields.' });
      return;
    }

    setIsSaving(true);
    try {
      if (employee) {
        await updateEmployee(employee.email, { name: name.trim(), role: role.trim(), department: department.trim() });
        toast({ title: 'Updated', description: `${name} has been updated.` });
      } else {
        await addEmployee({ name: name.trim(), email: email.trim(), role: role.trim(), department: department.trim() });
        toast({ title: 'Created', description: `${name} has been added to the directory.` });
      }
      onSuccess?.();
      close();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: err instanceof Error ? err.message : 'Operation failed.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{employee ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
          <DialogDescription>{employee ? 'Update employee details.' : 'Create a new employee in the directory.'}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" disabled={!!employee} />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <Label>Department</Label>
            <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={close} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : employee ? 'Save changes' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EmployeeFormDialog2;
