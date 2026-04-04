import { z } from "zod";

const schema = z.object({
	PORT: z.coerce.number().default(8082),
});

export default () => schema.parse(process.env);
