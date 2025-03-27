import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from './ui/card';
import { Button } from '@/components/ui/button';
import React from 'react';

export default function ThirdBundle() {
	return (
		<div>
			<Card className="bg-black text-white">
				<CardHeader>
					<CardTitle>Troisième Bundle</CardTitle>
				</CardHeader>
				<CardContent>
					<p>1000 pièces premium</p>
				</CardContent>
				<CardFooter>
					<Button asChild variant="destructive" className="mr-2">
						<form
							action="/api/checkout_sessions/third_bundle"
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
