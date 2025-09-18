import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/stores";
import { fetchStudentsStart } from "@/stores/slices/studentSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, MapPin, Phone, User, GraduationCap } from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { students, loading } = useSelector((state: RootState) => state.students);
  const student = students.find(s => String(s.id) === String(id));

  // fetch students if not loaded yet
  useEffect(() => {
    if (!students.length) {
      dispatch(fetchStudentsStart());
    }
  }, [dispatch, students.length]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Loading student…</CardTitle>
            <CardDescription>Please wait.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
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
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Student Details</h1>
        <div className="flex gap-2">
          <Link to={`/students/${student.id}/edit`}><Button className="h-10 px-4">Edit</Button></Link>
          <Button variant="outline" onClick={() => navigate(-1)} className="h-10 px-4">Back</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">First Name</Label>
              <p className="font-medium">{student.firstName}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <p className="font-medium">{student.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
              <p className="break-all">{student.email}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</Label>
              <p>{student.phone}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Date of Birth</Label>
              <p>{new Date(student.dateOfBirth).toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Enrollment Date</Label>
              <p>{new Date(student.enrollmentDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" /> Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Major</Label>
              <p className="font-medium">{student.major}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Year</Label>
              <p>{student.year}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">GPA</Label>
              <p className="text-lg font-semibold">{Number(student.gpa).toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div>
                <Badge>{student.status}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 p-3 rounded-md bg-muted/40">
            <p className="font-medium">{student?.address?.street}</p>
            <p className="text-sm text-muted-foreground">{student?.address?.city}, {student?.address?.state} {student?.address?.zipCode}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
