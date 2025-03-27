import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function SecondBundle() {
	return (
		<div>
			<Card className="bg-black text-white">
				<CardHeader>
					<CardTitle>Deuxième Bundle</CardTitle>
				</CardHeader>
				<CardContent>
					<p>100 pièces premiums</p>
				</CardContent>
				<CardFooter>
					<Button asChild variant="destructive" className="mr-2">
						<form
							action="/api/checkout_sessions/second_bundle"
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
