import { scryptSync } from "node:crypto";

import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CreateUserSchema } from "./schemas/create-user.schema";
import { UpdateUserSchema } from "./schemas/update-user.schema";
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

	async getUserById(id: string) {
		const user = await this.repository.findUserById(id);

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		return user;
	}

	async updateUser(id: string, data: UpdateUserSchema) {
		const user = await this.repository.findUserById(id);

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		if (data.username) {
			const existingUsername = await this.repository.findUserByUsername(
				data.username,
			);
			if (existingUsername && existingUsername.id !== id) {
				throw new ConflictException("Nome de usuário já existe");
			}
		}

		if (data.email) {
			const existingEmail = await this.repository.findUserByEmail(
				data.email,
			);
			if (existingEmail && existingEmail.id !== id) {
				throw new ConflictException("Email já existe");
			}
		}

		if (data.password) {
			data.password = scryptSync(
				data.password,
				this.config.getOrThrow<string>("CRYPTO_SALT"),
				64,
			).toString("base64");
		}

		try {
			const updatedUser = await this.repository.updateUser(id, data);
			return updatedUser;
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException("Erro ao atualizar usuário");
		}
	}

	async deleteUser(id: string) {
		const user = await this.repository.findUserById(id);

		if (!user) {
			throw new NotFoundException("Usuário não encontrado");
		}

		try {
			await this.repository.deleteUser(id);
		} catch (error) {
			this.logger.error(error);
			throw new InternalServerErrorException("Erro ao deletar usuário");
		}
	}

	async getPublicPostsByUserId(userId: string) {
		await this.getUserById(userId);
		return this.repository.findPublicPostsByUserId(userId);
	}

	async getCommentsFromPublicPostsByUserId(userId: string) {
		await this.getUserById(userId);
		return this.repository.findCommentsFromPublicPostsByUserId(userId);
	}
}
