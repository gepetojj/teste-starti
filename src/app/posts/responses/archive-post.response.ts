import { createZodDto } from "nestjs-zod";
import z from "zod";

export const archivePostResponseSchema = z.object({
	id: z
		.string()
		.describe("ID do post em formato semantic id. Padrão: post_<cuid2>"),
	archived: z.boolean().describe("Indica se o post está arquivado."),
	updatedAt: z.iso.datetime().describe("Data de atualização do post."),
});

export class ArchivePostResponse extends createZodDto(
	archivePostResponseSchema,
) {}
