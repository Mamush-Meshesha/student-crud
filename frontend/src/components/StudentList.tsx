"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Search,
  Loader2,
} from "lucide-react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { fetchStudentsStart, deleteStudentStart } from "../stores/slices/studentSlice";
import { RootState, AppDispatch } from "@/stores";
import type { Student } from "@/stores/slices/studentSlice";

function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const openDialog = (student: Student) => {
    setStudentToDelete(student);
    setIsOpen(true);
  };
  const closeDialog = () => {
    setIsOpen(false);
    setStudentToDelete(null);
  };
  return { isOpen, studentToDelete, openDialog, closeDialog };
}

export function StudentList() {
  const dispatch: AppDispatch = useDispatch();
  const { students, loading, error } = useSelector((state: RootState) => state.students);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, studentToDelete, openDialog, closeDialog } = useDeleteConfirmation();
  const navigate = useNavigate();

  console.log("students", students);
  useEffect(() => {
    dispatch(fetchStudentsStart());
  }, [dispatch]);

  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const firstName = (student.firstName ?? "").toLowerCase();
    const lastName = (student.lastName ?? "").toLowerCase();
    const email = (student.email ?? "").toLowerCase();
    const major = (student.major ?? "").toLowerCase();
    return (
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      email.includes(searchLower) ||
      major.includes(searchLower)
    );
  });

  const handleView = (student: Student) => navigate(`/students/${student.id}`);
  const handleEdit = (student: Student) => navigate(`/students/${student.id}/edit`);
  const handleConfirmDelete = () => {
    if (studentToDelete) {
      dispatch(deleteStudentStart(studentToDelete.id));
      closeDialog();
    }
  };

  const getStatusBadgeVariant = (status: Student["status"]) => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Graduated":
        return "outline";
      case "Suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Students</CardTitle>
            <div className="relative w-72 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.currentTarget.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6 text-primary" />
            </div>
          ) : error ? (
            <div className="p-6 text-center text-destructive">
              <p className="mb-3">{error}</p>
              <Button variant="outline" onClick={() => dispatch(fetchStudentsStart())}>Retry</Button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No students found.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold px-3 py-2">Name</TableHead>
                    <TableHead className="font-semibold px-3 py-2">Email</TableHead>
                    <TableHead className="font-semibold px-3 py-2">Major</TableHead>
                    <TableHead className="font-semibold px-3 py-2">Year</TableHead>
                    <TableHead className="font-semibold px-3 py-2">GPA</TableHead>
                    <TableHead className="font-semibold px-3 py-2">Status</TableHead>
                    <TableHead className="font-semibold px-3 py-2 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="hover:bg-muted/30">
                      <TableCell className="px-3 py-2 font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="px-3 py-2 text-muted-foreground">
                        {student.email}
                      </TableCell>
                      <TableCell className="px-3 py-2">{(student.major ?? "").trim() || "-"}</TableCell>
                      <TableCell className="px-3 py-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground/80">
                          {(student.year ?? "").toString() || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 font-mono">
                        {Number.isFinite(student.gpa) ? Number(student.gpa).toFixed(2) : "-"}
                      </TableCell>
                      <TableCell className="px-3 py-2">
                        <Badge variant={getStatusBadgeVariant(student.status)}>
                          {(student.status ?? "").trim() || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(student)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(student)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog(student)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
        isLoading={loading}
      />
    </>
  );
}
