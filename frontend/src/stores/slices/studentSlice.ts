/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  enrollmentDate: string;
  major: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  address: Address;
}

export type StudentFormData = Omit<Student, 'id'> & {
  password?: string;
  confirmPassword?: string;
};

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  modalMode: 'create' | 'edit' | 'view';
  selectedStudent: Student | null;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: null,
  isModalOpen: false,
  modalMode: 'create',
  selectedStudent: null,
};

// Helper to ensure all required fields exist so UI doesn't show N/A incorrectly
function normalizeStudent(input: Partial<Student>): Student {
  // Extract possible major/department field from various backend responses
  const possibleMajor = (
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).major ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).majorName ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).department ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).departmentName ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).dept ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).program ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).programme ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).fieldOfStudy ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).course ??
    (input as Partial<Record<'major' | 'majorName' | 'department' | 'departmentName' | 'dept' | 'program' | 'programme' | 'fieldOfStudy' | 'course' | 'specialization', unknown>>).specialization ??
    ""
  );

  return {
    id: String(input.id ?? ""),
    firstName: (input.firstName ?? "").toString().trim(),
    lastName: (input.lastName ?? "").toString().trim(),
    email: (input.email ?? "").toString().trim(),
    phone: (input.phone ?? "").toString().trim(),
    dateOfBirth: input.dateOfBirth ?? "",
    enrollmentDate: input.enrollmentDate ?? "",
    // Support alternative backend keys for major/department
    major: String(possibleMajor ?? "").trim(),
    year: (input.year as Student["year"]) ?? "Freshman",
    gpa: typeof input.gpa === "number" ? input.gpa : Number(input.gpa ?? 0),
    status: ((input.status as Student["status"]) ?? "Active") as StudentsState["students"][number]["status"],
    address: {
      street: (input.address?.street ?? "").toString().trim(),
      city: (input.address?.city ?? "").toString().trim(),
      state: (input.address?.state ?? "").toString().trim(),
      zipCode: (input.address?.zipCode ?? "").toString().trim(),
    },
  };
}

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchStudentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess(state, action: PayloadAction<Student[]>) {
      state.students = action.payload.map((s) => normalizeStudent(s));
      state.loading = false;
    },
    fetchStudentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createStudentRequest(state, action: PayloadAction<StudentFormData>) {
      state.loading = true;
      state.error = null;
    },
    createStudentSuccess(state, action: PayloadAction<Student>) {
      state.students.push(normalizeStudent(action.payload));
      state.loading = false;
      state.isModalOpen = false;
    },
    createStudentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateStudentRequest(state, action: PayloadAction<{ id: string; data: StudentFormData }>) {
      state.loading = true;
      state.error = null;
    },
     fetchStudentByIdSuccess(state, action: PayloadAction<Student>) {
      state.loading = false;
      state.error = null;
    },
    fetchStudentByIdFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateStudentSuccess(state, action: PayloadAction<Student>) {
      const normalized = normalizeStudent(action.payload);
      const index = state.students.findIndex(s => s.id === normalized.id);
      if (index !== -1) {
        state.students[index] = normalized;
      }
      state.loading = false;
      state.isModalOpen = false;
    },
    updateStudentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteStudentStart(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    deleteStudentSuccess(state, action: PayloadAction<string>) {
      state.students = state.students.filter(student => student.id !== action.payload);
      state.loading = false;
    },
    deleteStudentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    openModal(state, action: PayloadAction<{ mode: 'create' | 'edit' | 'view'; student?: Student }>) {
      state.isModalOpen = true;
      state.modalMode = action.payload.mode;
      state.selectedStudent = action.payload.student || null;
      state.error = null;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.selectedStudent = null;
    },
    clearError(state) {
      state.error = null;
    }
  },
});

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  createStudentRequest,
  createStudentSuccess,
  createStudentFailure,
  updateStudentRequest,
  updateStudentSuccess,
  updateStudentFailure,
  deleteStudentStart,
  deleteStudentSuccess,
  deleteStudentFailure,
  fetchStudentByIdSuccess,
  fetchStudentByIdFailure,
  openModal,
  closeModal,
  clearError,
} = studentSlice.actions;

export default studentSlice.reducer;