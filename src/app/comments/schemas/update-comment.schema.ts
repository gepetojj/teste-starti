import { createZodDto } from "nestjs-zod";
import z from "zod";

const updateCommentSchema = z.object({
	message: z
		.string()
		.min(1)
		.max(2000)
		.optional()
		.describe("Conteúdo do comentário."),
});

export class UpdateCommentSchema extends createZodDto(updateCommentSchema) {}
