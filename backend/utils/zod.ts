import z from "zod";
export const RegisterUserSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  password: z.string().min(8).max(255),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zipCode: z.string().min(1),
  }),
  birthDate: z.string().datetime().optional(),
  academicYear: z.string().optional(),
  gpa: z.number().optional(),
  status: z.string().optional(),
  pictureUrl: z.string().url().optional(),
  age: z.number().optional(),
});