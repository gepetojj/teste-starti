import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import compression from "compression";
import helmet from "helmet";
import { cleanupOpenApiDoc } from "nestjs-zod";

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

	const config = new DocumentBuilder()
		.setTitle("Teste Starti")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, config, {
		operationIdFactory: (
			controllerKey: string,
			methodKey: string,
			version?: string,
		) => {
			const controller = controllerKey
				.replace(/Controller$/, "")
				.toLowerCase()
				.split("-")
				.map((word, index) =>
					index === 0
						? word
						: word.charAt(0).toUpperCase() + word.slice(1),
				)
				.join("");
			return `${controller}_${methodKey}_${version}`;
		},
	});
	SwaggerModule.setup("swagger", app, cleanupOpenApiDoc(document));

	await app.listen(configService.getOrThrow<number>("PORT"));
}

void bootstrap();
