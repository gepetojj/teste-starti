import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { DrizzleModule } from "./db/drizzle.module";
import env from "./lib/env";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [env],
		}),
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: seconds(10),
					limit: 15,
				},
			],
		}),
		DrizzleModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
