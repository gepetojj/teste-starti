import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export const DrizzleAsyncProvider = "DrizzleAsyncProvider";
export type DrizzleDatabase = NodePgDatabase<typeof schema>;

export const drizzleProvider = [
	{
		provide: DrizzleAsyncProvider,
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => {
			const connectionString =
				configService.getOrThrow<string>("DATABASE_URL");
			const pool = new Pool({
				connectionString,
			});

			return drizzle(pool, { schema }) as DrizzleDatabase;
		},
	},
];
