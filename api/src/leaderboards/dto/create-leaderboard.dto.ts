import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateLeaderboardDto {
	@IsUUID()
	@IsNotEmpty()
	gameId: string;

	@IsOptional()
	@IsBoolean()
	isClosed: boolean;
}
