import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
        return NextResponse.json({ error: 'Please provide a valid session_id (`cs_test_...`)' }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['line_items', 'payment_intent'],
        });

        if (session.status === 'open') {
            return NextResponse.redirect('/');
        }

        return NextResponse.json({
            status: session.status,
            amount_total: session.amount_total,
            currency: session.currency,
            line_items: session.line_items?.data.map((item) => ({
                quantity: item.quantity,
            })),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve checkout session' }, { status: 500 });
    }
}
