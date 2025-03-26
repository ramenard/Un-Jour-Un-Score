'use client'

import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Checkout() {
    const searchParams = useSearchParams();
    const canceled = searchParams.get('canceled') === 'true';

	if (canceled) {
		console.log(
			'Order canceled -- continue to shop around and checkout when you’re ready.',
		);
	}
	return (
        <Button
            asChild
            variant="destructive"
            className="mr-2"
        >
            <form action="/api/checkout_sessions" method="POST">
                <section>
                    <button type="submit" role="link">
                        Checkout
                    </button>
                </section>
            </form>
        </Button>
	);
}
