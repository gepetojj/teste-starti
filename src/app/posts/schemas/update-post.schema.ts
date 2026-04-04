import { createZodDto } from "nestjs-zod";
import z from "zod";

const updatePostSchema = z.object({
	text: z.string().min(1).max(5000).optional().describe("Conteúdo do post."),
});

export class UpdatePostSchema extends createZodDto(updatePostSchema) {}
