import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

declare global {
	interface HotModule {
		hot?: {
			accept(callback?: () => void): void;
			dispose(callback: () => void): void;
		};
	}
}

declare const module: HotModule;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({ transform: true }));
	app.enableCors();
	await app.listen(process.env.PORT ?? 3001);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => {
			void app.close();
		});
	}
}
bootstrap();
