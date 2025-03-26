'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LineItem {
    quantity: number;
}

// Définition du type des données de la session de paiement Stripe
interface CheckoutData {
    status: string;
    amount_total: number;
    currency: string;
    line_items: LineItem[];
}

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (session_id) {
            fetch(`/api/checkout-success?session_id=${session_id}`)
                .then(res => res.json())
                .then((data: CheckoutData | { error: string }) => {
                    if ('error' in data) {
                        setError(data.error);
                    } else {
                        setCheckoutData(data);
                    }
                })
                .catch(err => setError('Failed to fetch checkout data.'));
        }
    }, [session_id]);

    if (error) return <p className="text-red-500">{error}</p>;

    if (!checkoutData) return <p className="text-white">Loading...</p>;

    return (
        <section id="success">
            <p className="text-white">
                We appreciate your business! A confirmation email will be sent. If you have any questions, please email{' '}
                <a href="mailto:orders@example.com" className="text-white">orders@example.com</a>.
            </p>
            <p className="text-white">Total Amount: {checkoutData.amount_total / 100} {checkoutData.currency.toUpperCase()}</p>
            <p className="text-white">Items Purchased:</p>
            <ul className="text-white">
                {checkoutData.line_items?.map((item: any, index: number) => (
                    <li key={index}>Quantity: {item.quantity}</li>
                ))}
            </ul>
        </section>
    );
}
