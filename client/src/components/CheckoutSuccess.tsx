import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export default async function CheckoutSuccess(session_id: string | null) {
	if (!session_id)
		throw new Error('Please provide a valid session_id (`cs_test_...`)');

	const { status, amount_total, line_items } =
		await stripe.checkout.sessions.retrieve(session_id, {
			expand: ['line_items', 'payment_intent'],
		});

	if (status === 'open') {
		return redirect('/');
	}

	if (status === 'complete') {
		return (
			<section id="success">
				<p className="text-white">
					We appreciate your business! A confirmation email will be
					sent to {amount_total}. If you have any questions, please
					email , {line_items?.data.map((data) => data.quantity)}
				</p>
				<a href="mailto:orders@example.com" className="text-white">
					orders@example.com
				</a>
				.
			</section>
		);
	}
}
