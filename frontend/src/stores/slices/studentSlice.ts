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

export type StudentFormData = Omit<Student, 'id'>;

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

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchStudentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchStudentsSuccess(state, action: PayloadAction<Student[]>) {
      state.students = action.payload;
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
      state.students.push(action.payload);
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
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
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