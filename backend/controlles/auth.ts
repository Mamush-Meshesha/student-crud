import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const register = async (req: Request, res: Response) => {
    const {firstName, lastName, email, password} = req.body;

    try {
        const user = await prisma.student.findUnique({where: {email}});
        if (user) {
            return res.status(400).json({message: "User already exists"});
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.student.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});
        res.status(201).json({token, user: newUser});


    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
}

const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        const user = await prisma.student.findUnique({where: {email}});
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET || "secret", {expiresIn: "1h"});
        res.status(200).json({token, user});

    } catch (error) {
        res.status(500).json({message: "Server error", error});
    }
}

export {register, login};
