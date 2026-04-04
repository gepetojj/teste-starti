import { createZodDto } from "nestjs-zod";
import z from "zod";

export const createPostResponseSchema = z.object({
	id: z
		.string()
		.describe("ID do post em formato semantic id. Padrão: post_<cuid2>"),
	userId: z.string().nullable().describe("ID do autor do post."),
	text: z.string().describe("Conteúdo do post."),
	archived: z.boolean().describe("Indica se o post está arquivado."),
	createdAt: z.iso.datetime().describe("Data de criação do post."),
});

export class CreatePostResponse extends createZodDto(
	createPostResponseSchema,
) {}
