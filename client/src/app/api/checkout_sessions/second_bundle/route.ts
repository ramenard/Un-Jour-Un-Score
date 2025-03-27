import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST() {
	try {
		const headersList = await headers();
		const origin = headersList.get('origin');

		// Create Checkout Sessions from body params.
		const session = await stripe.checkout.sessions.create({
			line_items: [
				{
					// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
					price: 'price_1R6uQRH2NnCGBqs20SSqM9OE',
					quantity: 100,
				},
			],
			mode: 'payment',
			success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/checkout?canceled=true`,
		});

		return NextResponse.redirect(session.url!, 303);
	} catch (err) {
		return NextResponse.json({ error: err });
	}
}
