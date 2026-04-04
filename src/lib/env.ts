import { loadEnvFile } from "node:process";

import { z } from "zod";

loadEnvFile();

const schema = z.object({
	PORT: z.coerce.number().default(8082),
	DATABASE_URL: z.string(),
	CRYPTO_SALT: z.string(),
});

export default () => schema.parse(process.env);
