import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import compression from "compression";
import helmet from "helmet";

import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const configService = app.get(ConfigService);

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});
	app.use(helmet());
	app.use(compression());
	app.enableCors({
		origin: "*",
	});

	await app.listen(configService.getOrThrow<number>("PORT"));
}

void bootstrap();
