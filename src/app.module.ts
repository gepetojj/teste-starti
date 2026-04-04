import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { seconds, ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { CommentsModule } from "./app/comments/comments.module";
import { PostsModule } from "./app/posts/posts.module";
import { UsersModule } from "./app/users/users.module";
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

		// App
		UsersModule,
		PostsModule,
		CommentsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ZodSerializerInterceptor,
		},
	],
})
export class AppModule {}
