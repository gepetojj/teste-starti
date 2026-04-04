import { createZodDto } from "nestjs-zod";
import z from "zod";

const createPostSchema = z.object({
	userId: z.string().describe("ID do autor do post."),
	text: z.string().min(1).max(5000).describe("Conteúdo do post."),
});

export class CreatePostSchema extends createZodDto(createPostSchema) {}
