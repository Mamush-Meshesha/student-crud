import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { openModal, fetchStudentsStart } from "@/stores/slices/studentSlice";
import { StudentFormModal } from "@/components/StudentFormModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function StudentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { students, isModalOpen } = useSelector((state: RootState) => state.students);
  const student = students.find((s) => String(s.id) === String(id));
  const openedRef = useRef(false);

  useEffect(() => {
    if (!students.length) {
      dispatch(fetchStudentsStart());
    }
  }, [dispatch, students.length]);

  useEffect(() => {
    if (student && !openedRef.current) {
      openedRef.current = true;
      dispatch(openModal({ mode: "edit", student }));
    }
  }, [dispatch, student]);

  // When modal closes, go back to previous page
  useEffect(() => {
    if (openedRef.current && !isModalOpen) {
      navigate(-1);
    }
  }, [isModalOpen, navigate]);

  if (!student) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Student not found</CardTitle>
            <CardDescription>The requested student does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Edit Student</h1>
        <Button variant="outline" onClick={() => navigate(-1)} className="h-10 px-4">Back</Button>
      </div>
      <StudentFormModal />
    </div>
  );
}
