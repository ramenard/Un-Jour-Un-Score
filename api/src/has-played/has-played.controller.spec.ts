import { Test, TestingModule } from '@nestjs/testing';
import { HasPlayedController } from './has-played.controller';
import { HasPlayedService } from './has-played.service';

describe('HasPlayedController', () => {
	let controller: HasPlayedController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [HasPlayedController],
			providers: [HasPlayedService],
		}).compile();

		controller = module.get<HasPlayedController>(HasPlayedController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
