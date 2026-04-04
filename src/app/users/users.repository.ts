import { Inject, Injectable } from "@nestjs/common";
import {
	DrizzleAsyncProvider,
	type DrizzleDatabase,
} from "src/db/drizzle.provider";

@Injectable()
export class UsersRepository {
	constructor(
		@Inject(DrizzleAsyncProvider)
		private readonly db: DrizzleDatabase,
	) {}
}
