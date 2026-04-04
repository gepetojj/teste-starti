import { createZodDto } from "nestjs-zod";
import z from "zod";

const createUserSchema = z.object({
	username: z.string().min(3).max(36),
	name: z.string().min(3).max(125),
	email: z.email(),
	password: z.string().min(8).max(125),
	biography: z.string().max(255).optional(),
});

export class CreateUserSchema extends createZodDto(createUserSchema) {}
