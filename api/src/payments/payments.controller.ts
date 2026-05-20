import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { SecurityGuard } from '../security/security.guard';
import { RequestWithUserInfo } from '../security/security.controller';

@UseGuards(SecurityGuard)
@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Get('packages')
	getPackages() {
		return this.paymentsService.getPackages();
	}

	@Post('create-payment-intent')
	createPaymentIntent(
		@Req() req: RequestWithUserInfo,
		@Body() body: { packageId: string },
	) {
		return this.paymentsService.createPaymentIntent(req.user.id, body.packageId);
	}

	@Post('confirm')
	confirmPayment(
		@Req() req: RequestWithUserInfo,
		@Body() body: { paymentIntentId: string },
	) {
		return this.paymentsService.confirmPayment(req.user.id, body.paymentIntentId);
	}
}