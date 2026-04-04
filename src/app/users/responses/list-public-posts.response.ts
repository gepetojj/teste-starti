import { createZodDto } from "nestjs-zod";
import z from "zod";

const publicPostItemSchema = z.object({
	id: z
		.string()
		.describe("ID do post em formato semantic id. Padrão: post_<cuid2>"),
	userId: z.string().nullable().describe("ID do autor do post."),
	text: z.string().describe("Conteúdo do post."),
	createdAt: z.iso.date().describe("Data de criação do post."),
	updatedAt: z.iso.date().describe("Data de atualização do post."),
});

export const listPublicPostsResponseSchema = z.array(publicPostItemSchema);

export class ListPublicPostsResponse extends createZodDto(
	listPublicPostsResponseSchema,
) {}
