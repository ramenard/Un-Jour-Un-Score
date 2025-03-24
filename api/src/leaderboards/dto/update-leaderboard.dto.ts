import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateLeaderboardDto {
	@IsNotEmpty()
	@IsBoolean()
	isClosed: boolean;
}
