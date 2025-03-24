import { Test, TestingModule } from '@nestjs/testing';
import { HasPlayedService } from './has-played.service';

describe('HasPlayedService', () => {
	let service: HasPlayedService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [HasPlayedService],
		}).compile();

		service = module.get<HasPlayedService>(HasPlayedService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
