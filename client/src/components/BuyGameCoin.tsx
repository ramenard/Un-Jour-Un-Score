'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UpdateUserDto } from '@/types/user';

const Profil: React.FC = () => {
	const [isBuyingGameCoins, setIsBuyingGameCoins] = useState(false);
	const { user, fetchUser } = useUser();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const buyGameCoin = useCallback(async () => {
		if (!user) {
			return;
		}

		setIsBuyingGameCoins(true);

		const updatePremiumCoins: UpdateUserDto = {
			premiumCoins: user.premiumCoins - 10,
			gameCoins: user.gameCoins + 1,
		};

		await fetch('/api/user', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updatePremiumCoins),
		});

		await fetchUser();
		setIsBuyingGameCoins(false);
	}, [user, fetchUser]);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<Card className="bg-black text-white">
				<CardHeader>
					<CardTitle>Echange pièces premiums</CardTitle>
				</CardHeader>
				<CardContent>
					<p>Pièces premium: {user.premiumCoins}</p>
					<p>10 pièces premiums = 1 pièce de jeu</p>
				</CardContent>
				<CardFooter>
					<Button asChild variant="destructive" className="mr-2">
						<button
							onClick={buyGameCoin}
							disabled={
								user.premiumCoins < 10 || isBuyingGameCoins
							}
						>
							Payer
						</button>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Profil;
