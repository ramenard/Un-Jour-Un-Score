'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useUser } from '@/context/UserContext';
import { UpdateUserDto } from '@/types/user';

interface LineItem {
	quantity: number;
}

interface CheckoutData {
	status: string;
	amount_total: number;
	currency: string;
	line_items: LineItem[];
}

const SuccessContent: React.FC = () => {
	const searchParams = useSearchParams();
	const session_id = searchParams.get('session_id');
	const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const { user, fetchUser } = useUser();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	useEffect(() => {
		if (!user || !checkoutData) {
			return;
		}

		const updatePremiumCoins: UpdateUserDto = {
			premiumCoins:
				user.premiumCoins + checkoutData.line_items[0].quantity,
		};

		fetch('/api/user', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatePremiumCoins),
		});
	}, [user, checkoutData]);

	useEffect(() => {
		if (session_id) {
			fetch(`/api/checkout-success?session_id=${session_id}`)
				.then((res) => res.json())
				.then((data: CheckoutData | { error: string }) => {
					if ('error' in data) {
						setError(data.error);
					} else {
						setCheckoutData(data);
					}
				})
				.catch(() => setError('Failed to fetch checkout data.'));
		}
	}, [session_id]);

	if (error) return <p className="text-red-500">{error}</p>;
	if (!checkoutData) return <p className="text-white">Loading...</p>;

	return (
		<div className="nes-theme min-h-screen flex flex-col items-center">
			<div
				className="nes-container"
				style={{ maxWidth: '70rem', width: '100%' }}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<i
						className="nes-bcrikko"
						style={{ marginRight: '16px' }}
					></i>
					<div>
						<section className="message-list">
							<section className="message -left">
								<div className="nes-balloon from-left">
									<p className="text-black">
										Merci pour votre achat!
									</p>
								</div>
							</section>

							<section className="message -left">
								<div className="nes-balloon from-left">
									<p className="text-black">
										Somme totale:{' '}
										{checkoutData.amount_total / 100}{' '}
										{checkoutData.currency.toUpperCase()}
									</p>
								</div>
							</section>

							<section className="message -left">
								<div className="nes-balloon from-left">
									{checkoutData.line_items?.map(
										(item: LineItem, index: number) => (
											<li key={index}>
												Quantité: {item.quantity} pièces
												premiums
											</li>
										),
									)}
								</div>
							</section>
						</section>
					</div>
				</div>
				<BorderBeam
					duration={6}
					size={600}
					className="from-transparent via-red-500 to-transparent"
				/>
				<BorderBeam
					duration={6}
					delay={3}
					size={600}
					className="from-transparent via-blue-500 to-transparent"
				/>
			</div>
		</div>
	);
};

export default function SuccessPage() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<SuccessContent />
		</Suspense>
	);
}
