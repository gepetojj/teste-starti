import { scryptSync } from "node:crypto";

import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CreateUserSchema } from "./schemas/create-user.schema";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);
	constructor(
		private readonly repository: UsersRepository,
		private readonly config: ConfigService,
	) {}

	async createUser(user: CreateUserSchema) {
		const [existingUsername, existingEmail] = await Promise.all([
			this.repository.findUserByUsername(user.username),
			this.repository.findUserByEmail(user.email),
		]);

		if (existingUsername || existingEmail) {
			throw new ConflictException(
				"Nome de usuário e/ou email já existem",
			);
		}

		user.password = scryptSync(
			user.password,
			this.config.getOrThrow<string>("CRYPTO_SALT"),
			64,
		).toString("base64");

		try {
			return this.repository.createUser(user);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException("Erro ao criar usuário");
		}
	}
}
