import { Test, TestingModule } from '@nestjs/testing';
import { ObtainedBadgesController } from './obtained-badges.controller';
import { ObtainedBadgesService } from './obtained-badges.service';

describe('ObtainedBadgesController', () => {
	let controller: ObtainedBadgesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ObtainedBadgesController],
			providers: [ObtainedBadgesService],
		}).compile();

		controller = module.get<ObtainedBadgesController>(
			ObtainedBadgesController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
