'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FirstBundle from '@/components/FirstBundle';
import SecondBundle from '@/components/SecondBundle';
import ThirdBundle from '@/components/ThirdBundle';
import BuyGameCoin from '@/components/BuyGameCoin';

function CheckoutContent() {
	const searchParams = useSearchParams();
	const canceled = searchParams.get('canceled') === 'true';

	if (canceled) {
		console.log('Order canceled -- continue to shop around.');
	}

	return (
		<div className="nes-theme min-h-screen">
			<div className="flex flex-col">
				<div className="flex flex-row justify-between px-48 pt-20">
					<div className="w-56">
						<FirstBundle />
					</div>
					<div className="w-56">
						<SecondBundle />
					</div>
					<div className="w-56">
						<ThirdBundle />
					</div>
				</div>
				<div className="pt-12 w-96 self-center pb-12">
					<BuyGameCoin />
				</div>
			</div>
		</div>
	);
}

export default function Checkout() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<CheckoutContent />
		</Suspense>
	);
}
