import { Router } from "express";
import { getAllStudents, getStudentById, updateStudent, deleteStudent } from "../controlles/student.js";

const router = Router();


router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;