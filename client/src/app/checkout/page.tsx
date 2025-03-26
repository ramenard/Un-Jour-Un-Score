'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const canceled = searchParams.get('canceled') === 'true';

    if (canceled) {
        console.log('Order canceled -- continue to shop around.');
    }

    return (
        <Button asChild variant="destructive" className="mr-2">
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

export default function Checkout() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <CheckoutContent />
        </Suspense>
    );
}
