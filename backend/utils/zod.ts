import z from "zod";

export const RegisterUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  password: z.string().min(8).max(255),
});

export const LoginUserSchema = z
  .object({
    email: z.string().email().optional(),
    password: z.string().min(8).max(255),
  })
  .refine((data) => data.email , {
    message: "Either email or phone must be provided",
  });

export const UpdateUserProfile = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(10).max(20).optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
 
  })
  .refine(
    (data) => data.email || data.phone,
    {
      message: "At least one field must be provided for update",
    }
  );