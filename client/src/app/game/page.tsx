'use client';

import { Suspense, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

import CoinFlip from '@/components/CoinFlip';
import RockPaperScissors from '@/components/RockPaperScissors';
import { Leaderboard } from '@/types/leaderboard';
import { Has_played } from '@/types/has_played';

function GameContent() {
	const searchParams = useSearchParams();
	const gameName: string | null = searchParams.get('name');

	const hasRun = useRef(false);

	const createHasPlayedIfNotExist = useCallback(async () => {
		const leaderboard: Leaderboard = await fetchLeaderboard();
		const has_played: Has_played[] = await fetchHasPlayed(leaderboard.id);

		if (has_played.length) {
			console.log('has_played exist !!');
			return;
		}

		const hasPlayedCreateResponse = await createHasPlayed();
		console.log(hasPlayedCreateResponse);
	}, []);

	useEffect(() => {
		if (!hasRun.current) {
			hasRun.current = true;
			createHasPlayedIfNotExist();
		}
	}, [createHasPlayedIfNotExist]);

	const fetchLeaderboard = async () => {
		const response = await fetch('/api/leaderboard/current', {
			method: 'GET',
		});
		return response.json();
	};

	const fetchHasPlayed = async (leaderboardId: string) => {
		const response = await fetch(
			`/api/has_played/current?leaderboardId=${leaderboardId}`,
			{
				method: 'GET',
			},
		);
		return response.json();
	};

	const createHasPlayed = async () => {
		const response = await fetch(`/api/has_played/create`, {
			method: 'POST',
		});
		return response.json();
	};

	return (
		<div>
			{gameName === 'coin-flip' && <CoinFlip />}
			{gameName === 'rock-paper-scissors' && <RockPaperScissors />}
		</div>
	);
}

export default function Game() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<GameContent />
		</Suspense>
	);
}
