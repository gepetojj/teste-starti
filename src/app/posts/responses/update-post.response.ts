import { createZodDto } from "nestjs-zod";
import z from "zod";

export const updatePostResponseSchema = z.object({
	id: z
		.string()
		.describe("ID do post em formato semantic id. Padrão: post_<cuid2>"),
	userId: z.string().nullable().describe("ID do autor do post."),
	text: z.string().describe("Conteúdo do post."),
	archived: z.boolean().describe("Indica se o post está arquivado."),
	updatedAt: z.iso.datetime().describe("Data de atualização do post."),
});

export class UpdatePostResponse extends createZodDto(
	updatePostResponseSchema,
) {}
