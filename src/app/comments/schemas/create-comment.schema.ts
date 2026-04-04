import { createZodDto } from "nestjs-zod";
import z from "zod";

const createCommentSchema = z.object({
	userId: z.string().describe("ID do autor do comentário."),
	postId: z.string().describe("ID do post ao qual o comentário pertence."),
	message: z.string().min(1).max(2000).describe("Conteúdo do comentário."),
});

export class CreateCommentSchema extends createZodDto(createCommentSchema) {}
