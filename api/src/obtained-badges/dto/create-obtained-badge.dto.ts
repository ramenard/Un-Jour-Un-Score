import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateObtainedBadgeDto {
	@IsUUID()
	@IsNotEmpty()
	userId: string;

	@IsUUID()
	@IsNotEmpty()
	badgeId: string;
}
