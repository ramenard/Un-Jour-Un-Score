import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { UsersService } from '../users/users.service';

export const COIN_PACKAGES = [
	{ id: 'pack_10', coins: 10, amount: 199, currency: 'eur', label: 'Pack Starter', description: '10 jetons premium' },
	{ id: 'pack_50', coins: 50, amount: 799, currency: 'eur', label: 'Pack Pro', description: '50 jetons premium' },
	{ id: 'pack_100', coins: 100, amount: 1299, currency: 'eur', label: 'Pack Elite', description: '100 jetons premium' },
];

@Injectable()
export class PaymentsService {
	private stripe: InstanceType<typeof Stripe>;

	constructor(
		private configService: ConfigService,
		private usersService: UsersService,
	) {
		this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY')!);
	}

	getPackages() {
		return COIN_PACKAGES;
	}

	async createPaymentIntent(userId: string, packageId: string) {
		const pkg = COIN_PACKAGES.find((p) => p.id === packageId);
		if (!pkg) throw new NotFoundException('Package introuvable');

		const paymentIntent = await this.stripe.paymentIntents.create({
			amount: pkg.amount,
			currency: pkg.currency,
			metadata: { userId, packageId, coins: pkg.coins.toString() },
			automatic_payment_methods: { enabled: true },
		});

		return {
			clientSecret: paymentIntent.client_secret,
			paymentIntentId: paymentIntent.id,
			...pkg,
		};
	}

	async confirmPayment(userId: string, paymentIntentId: string) {
		const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

		if (paymentIntent.metadata.userId !== userId) {
			throw new BadRequestException('Ce paiement ne vous appartient pas');
		}
		if (paymentIntent.status !== 'succeeded') {
			throw new BadRequestException('Le paiement n\'a pas abouti');
		}

		const coins = parseInt(paymentIntent.metadata.coins, 10);
		const user = await this.usersService.findOneById(userId);
		await this.usersService.update(userId, { premiumCoins: user.premiumCoins + coins });

		return { coins, message: `${coins} jetons premium ajoutés avec succès !` };
	}
}