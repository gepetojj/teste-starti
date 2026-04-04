import { createZodDto } from "nestjs-zod";
import z from "zod";

export const getUserResponseSchema = z.object({
	id: z
		.string()
		.describe("ID do usuário em formato semantic id. Padrão: user_<cuid2>"),
	username: z.string().describe("Nome de usuário do usuário."),
	name: z.string().describe("Nome completo do usuário."),
	email: z.string().describe("Email do usuário."),
	biography: z.string().nullable().describe("Biografia do usuário."),
	createdAt: z.iso.datetime().describe("Data de criação do usuário."),
	updatedAt: z.iso.datetime().describe("Data de atualização do usuário."),
});

export class GetUserResponse extends createZodDto(getUserResponseSchema) {}
