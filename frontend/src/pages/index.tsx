"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StudentList } from "../components/StudentList";
import { StudentFormModal } from "../components/StudentFormModal";
import { Toaster } from "@/components/ui/sonner";
import { fetchStudentsStart, openModal } from "../stores/slices/studentSlice";
import { RootState, AppDispatch } from "@/stores";

function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.students);

  useEffect(() => {
    dispatch(fetchStudentsStart());
  }, [dispatch]);

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center space-x-4">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                  Student Management
                </CardTitle>
                <CardDescription>
                  An overview of all registered students in the system.
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-9 w-full sm:w-64 h-10"
                />
              </div>
              <Button onClick={() => dispatch(openModal({ mode: "create" }))} className="gap-2 h-10 px-4">
                <PlusCircle className="h-4 w-4" />
                Add New Student
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-center text-muted-foreground">Loading students...</p>}
            <StudentList />
          </CardContent>
        </Card>
      </div>
      <StudentFormModal />
      <Toaster />
    </>
  );
}

export default Home;