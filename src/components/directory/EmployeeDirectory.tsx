"use client";

import { useEffect, useState, useMemo } from "react";
import type { Employee } from "@/services/email";
import { getEmployees } from "@/services/email";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Users,
  Briefcase,
  Mail,
  Building,
  Search as SearchIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmployeeDirectoryProps {
  onEmployeeSelect: (email: string) => void;
}

export function EmployeeDirectory({ onEmployeeSelect }: EmployeeDirectoryProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEmployees();
        setEmployees(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load employees."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return employees.sort((a, b) => a.name.localeCompare(b.name));
    return employees
      .filter(
        (employee) =>
          employee.name.toLowerCase().includes(term) ||
          employee.role.toLowerCase().includes(term) ||
          employee.department.toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, searchTerm]);

  return (
    <Card className="w-full shadow-xl rounded-lg border hover:shadow-2xl transition-transform duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold text-primary">
          <Users className="mr-3 h-6 w-6 text-primary" />
          Employee Directory
        </CardTitle>
        <CardDescription>
          Browse and search company employees. Click a row to email an employee.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, role, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-input border focus:border-accent focus:ring-2 focus:ring-accent"
            aria-label="Search Employees"
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 p-3 border rounded-md bg-card/50 animate-pulse"
              >
                <Skeleton className="h-10 w-10 rounded-full bg-muted/70" />
                <div className="space-y-2 flex-grow">
                  <Skeleton className="h-4 w-3/4 bg-muted/70" />
                  <Skeleton className="h-4 w-1/2 bg-muted/70" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 text-red-500 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
            <AlertTriangle className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">Error Loading Employees</p>
            <p className="text-sm text-center">{error}</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground p-4 bg-muted/20 border rounded-md">
            <Users className="h-10 w-10 mb-3" />
            <p className="text-lg font-medium">No Employees Found</p>
            <p className="text-sm text-center">
              {searchTerm
                ? "No employees match your search."
                : "The employee directory is currently empty."}
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-450px)] pr-2">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.email}
                    onClick={() => onEmployeeSelect(employee.email)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      e.key === "Enter" && onEmployeeSelect(employee.email)
                    }
                  >
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
