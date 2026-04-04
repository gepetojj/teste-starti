import { loadEnvFile } from "node:process";

import { defineConfig } from "drizzle-kit";

loadEnvFile();

export default defineConfig({
	out: "./src/db/migrations",
	schema: "./src/db/schema",
	dialect: "postgresql",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: Ignore
		url: process.env.DATABASE_URL!,
	},
});
