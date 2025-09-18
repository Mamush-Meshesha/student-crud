/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2, User } from "lucide-react";
import { closeModal, createStudentRequest, updateStudentRequest, clearError } from "../stores/slices/studentSlice";
import type { StudentFormData } from "@/stores/slices/studentSlice";
import type { RootState } from "@/stores";

const initialFormData: StudentFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  enrollmentDate: "",
  major: "",
  year: "Freshman",
  gpa: 0,
  status: "Active",
  address: { street: "", city: "", state: "", zipCode: "" },
};

export function StudentFormModal() {
  const dispatch = useDispatch();
  const { isModalOpen, modalMode, selectedStudent, loading, error } = useSelector((state: RootState) => state.students);

  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedStudent && (modalMode === "edit" || modalMode === "view")) {
      const normalized = {
        ...initialFormData,
        ...selectedStudent,
        firstName: selectedStudent.firstName ?? "",
        lastName: selectedStudent.lastName ?? "",
        email: selectedStudent.email ?? "",
        phone: selectedStudent.phone ?? "",
        major: selectedStudent.major ?? (selectedStudent as any).department ?? "",
        year: (selectedStudent.year as typeof initialFormData.year) ?? initialFormData.year,
        gpa: typeof selectedStudent.gpa === "number" ? selectedStudent.gpa : Number(selectedStudent.gpa ?? 0),
        status: (selectedStudent.status as typeof initialFormData.status) ?? initialFormData.status,
        dateOfBirth: selectedStudent.dateOfBirth?.split("T")[0] ?? (selectedStudent.dateOfBirth || ""),
        enrollmentDate: selectedStudent.enrollmentDate?.split("T")[0] ?? (selectedStudent.enrollmentDate || ""),
        address: {
          street: selectedStudent.address?.street ?? "",
          city: selectedStudent.address?.city ?? "",
          state: selectedStudent.address?.state ?? "",
          zipCode: selectedStudent.address?.zipCode ?? "",
        },
      } as StudentFormData;
      setFormData(normalized);
    } else {
      setFormData(initialFormData);
    }
    setFormErrors({});
  }, [selectedStudent, modalMode, isModalOpen]);

  useEffect(() => {
    if (error) setFormErrors((prev) => ({ ...prev, general: error }));
  }, [error]);

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(clearError());
    setFormData(initialFormData);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required";
    if (!formData.enrollmentDate) errors.enrollmentDate = "Enrollment date is required";
    if (!formData.major.trim()) errors.major = "Major is required";
    if (formData.gpa < 0 || formData.gpa > 4) errors.gpa = "GPA must be between 0.0 and 4.0";
    if (!formData.address.street.trim()) errors.street = "Street address is required";
    if (!formData.address.city.trim()) errors.city = "City is required";
    if (!formData.address.state.trim()) errors.state = "State is required";
    if (!formData.address.zipCode.trim()) errors.zipCode = "ZIP code is required";

    // Password validation
    const pwd = formData.password ?? "";
    const cpwd = formData.confirmPassword ?? "";
    if (modalMode === "create") {
      // Required when creating
      if (!pwd.trim()) {
        errors.password = "Password is required";
      } else if (pwd.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (!cpwd.trim()) {
        errors.confirmPassword = "Please confirm your password";
      } else if (pwd && cpwd && pwd !== cpwd) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (modalMode === "edit") {
      // Optional on edit; validate only if provided
      if (pwd && pwd.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (pwd || cpwd) {
        if (!cpwd.trim()) {
          errors.confirmPassword = "Please confirm your password";
        } else if (pwd !== cpwd) {
          errors.confirmPassword = "Passwords do not match";
        }
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (modalMode === "create") {
      dispatch(createStudentRequest(formData));
    } else if (modalMode === "edit" && selectedStudent) {
      dispatch(updateStudentRequest({ id: selectedStudent.id, data: formData }));
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "address" && (child === "street" || child === "city" || child === "state" || child === "zipCode")) {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: String(value),
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value as never }));
    }
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const isViewMode = modalMode === "view";
  const title = modalMode === "create" ? "Add Student" : modalMode === "edit" ? "Edit Student" : "Student Details";

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-primary" /> {title}
          </DialogTitle>
        </DialogHeader>

        {isViewMode ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">First Name</Label>
                <p className="font-medium">{formData.firstName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Name</Label>
                <p className="font-medium">{formData.lastName}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="break-all">{formData.email}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p>{formData.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Date of Birth</Label>
                <p>{formData.dateOfBirth}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Enrollment Date</Label>
                <p>{formData.enrollmentDate}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Major</Label>
                <p className="font-medium">{formData.major}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Year</Label>
                <p>{formData.year}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">GPA</Label>
                <p className="font-medium">{Number(formData.gpa).toFixed(2)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <p>{formData.status}</p>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Address</Label>
              <p className="font-medium">{formData.address.street}</p>
              <p className="text-sm text-muted-foreground">{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleClose} variant="outline" className="h-10 px-4">Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formErrors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formErrors.general}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange("firstName", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.firstName && <p className="text-xs text-destructive mt-1">{formErrors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange("lastName", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.lastName && <p className="text-xs text-destructive mt-1">{formErrors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.email && <p className="text-xs text-destructive mt-1">{formErrors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password {modalMode === "create" ? <span className="text-muted-foreground text-xs">(required)</span> : <span className="text-muted-foreground text-xs">(optional)</span>}</Label>
                <Input id="password" type="password" value={formData.password ?? ""} onChange={(e) => handleInputChange("password", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.password && <p className="text-xs text-destructive mt-1">{formErrors.password}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange("phone", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.phone && <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="confirmPassword">Confirm Password {modalMode === "create" ? <span className="text-muted-foreground text-xs">(required)</span> : <span className="text-muted-foreground text-xs">(optional)</span>}</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword ?? ""} onChange={(e) => handleInputChange("confirmPassword", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{formErrors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.dateOfBirth && <p className="text-xs text-destructive mt-1">{formErrors.dateOfBirth}</p>}
              </div>
              <div>
                <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                <Input id="enrollmentDate" type="date" value={formData.enrollmentDate} onChange={(e) => handleInputChange("enrollmentDate", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.enrollmentDate && <p className="text-xs text-destructive mt-1">{formErrors.enrollmentDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="major">Major</Label>
                <Input id="major" value={formData.major} onChange={(e) => handleInputChange("major", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors.major && <p className="text-xs text-destructive mt-1">{formErrors.major}</p>}
              </div>
              <div>
                <Label htmlFor="year">Academic Year</Label>
                <Select value={formData.year} onValueChange={(v) => handleInputChange("year", v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" type="number" min="0" max="4" step="0.01" value={formData.gpa} onChange={(e) => handleInputChange("gpa", Number.parseFloat((e.target as HTMLInputElement).value) || 0)} className="h-10" />
                {formErrors.gpa && <p className="text-xs text-destructive mt-1">{formErrors.gpa}</p>}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Graduated">Graduated</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" value={formData?.address?.street} onChange={(e) => handleInputChange("address.street", (e.target as HTMLInputElement).value)} className="h-10" />
                {formErrors?.street && <p className="text-xs text-destructive mt-1">{formErrors?.street}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData?.address?.city} onChange={(e) => handleInputChange("address.city", (e.target as HTMLInputElement).value)} className="h-10" />
                  {formErrors?.city && <p className="text-xs text-destructive mt-1">{formErrors?.city}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={formData?.address?.state} onChange={(e) => handleInputChange("address.state", (e.target as HTMLInputElement).value)} className="h-10" />
                  {formErrors?.state && <p className="text-xs text-destructive mt-1">{formErrors?.state}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input id="zipCode" value={formData?.address?.zipCode} onChange={(e) => handleInputChange("address.zipCode", (e.target as HTMLInputElement).value)} className="h-10" />
                  {formErrors?.zipCode && <p className="text-xs text-destructive mt-1">{formErrors?.zipCode}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="h-10 px-4">Cancel</Button>
              <Button type="submit" disabled={loading} className="h-10 px-4">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> {modalMode === "create" ? "Creating..." : "Updating..."}</> : (modalMode === "create" ? "Create Student" : "Update Student")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
