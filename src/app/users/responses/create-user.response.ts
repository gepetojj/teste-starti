import { createZodDto } from "nestjs-zod";
import z from "zod";

export const createUserResponseSchema = z.object({
	id: z
		.string()
		.describe("ID do usuário em formato semantic id. Padrão: user_<cuid2>"),
	username: z.string().describe("Nome de usuário do usuário."),
});

export class CreateUserResponse extends createZodDto(
	createUserResponseSchema,
) {}
