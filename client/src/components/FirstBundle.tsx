import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function FirstBundle() {
	return (
		<div>
			<Card className="bg-black text-white">
				<CardHeader>
					<CardTitle>Premier Bundle</CardTitle>
				</CardHeader>
				<CardContent>
					<p>10 pièces premiums</p>
				</CardContent>
				<CardFooter>
					<Button asChild variant="destructive" className="mr-2">
						<form
							action="/api/checkout_sessions/first_bundle"
							method="POST"
						>
							<section>
								<button type="submit" role="link">
									Payer
								</button>
							</section>
						</form>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
