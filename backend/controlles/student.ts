import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const students = await prisma.student.findMany();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
}

const getStudentById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
        return res.status(400).json({message: "Invalid student id"});
    }
    try {
        const student = await prisma.student.findUnique({where: {id: idNum}});
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
}




const updateStudent = async (req: Request, res: Response) => {
    const {id} = req.params;
    const {firstName, lastName, email, age, major} = req.body;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
        return res.status(400).json({message: "Invalid student id"});
    }
    try {
        const student = await prisma.student.findUnique({where: {id: idNum}});
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        const updatedStudent = await prisma.student.update({
            where: {id: idNum},
            data: {
                firstName,
                lastName,
                email,
                age,
                major,
            },
        });
        res.status(200).json(updatedStudent);
 
    } catch (error) {

        res.status(500).json({message: "Server error", error});
    }

}

const deleteStudent = async (req: Request, res: Response) => {
    const {id} = req.params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
        return res.status(400).json({message: "Invalid student id"});
    }
    try {
        const student = await prisma.student.findUnique({where: {id: idNum}});
        if (!student) {
            return res.status(404).json({message: "Student not found"});
        }
        await prisma.student.delete({where: {id: idNum}});
        res.status(200).json({message: "Student deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }       

}

export {getAllStudents, getStudentById,  updateStudent, deleteStudent};   