import { createZodDto } from "nestjs-zod";
import z from "zod";

const updateUserSchema = z.object({
	username: z.string().min(3).max(36).optional(),
	name: z.string().min(3).max(125).optional(),
	email: z.email().optional(),
	password: z.string().min(8).max(125).optional(),
	biography: z.string().max(255).optional(),
});

export class UpdateUserSchema extends createZodDto(updateUserSchema) {}
