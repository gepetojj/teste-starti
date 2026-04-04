import { createZodDto } from "nestjs-zod";
import z from "zod";

export const updateCommentResponseSchema = z.object({
	id: z
		.string()
		.describe(
			"ID do comentário em formato semantic id. Padrão: comment_<cuid2>",
		),
	userId: z.string().nullable().describe("ID do autor do comentário."),
	postId: z.string().describe("ID do post ao qual o comentário pertence."),
	message: z.string().describe("Conteúdo do comentário."),
	updatedAt: z.iso.datetime().describe("Data de atualização do comentário."),
});

export class UpdateCommentResponse extends createZodDto(
	updateCommentResponseSchema,
) {}
