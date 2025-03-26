'use client';

import { Button } from '@/components/ui/button';
import React, { useCallback, useEffect, useState } from 'react';
import { SpinningText } from '@/components/magicui/spinning-text';
import { LeaderboardData } from '@/types/leaderboard';
import Leaderboard from '@/components/Leaderboard';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Game } from '@/types/game';

export default function Hero() {
	const { isAuth } = useAuth();
	const { canUserPlay, fetchUser, removeUserGameCoin } = useUser();

	const [leaderboardLoading, setLeaderboardLoading] = useState(false);
	const [userLeaderboardLoading, setUserLeaderboardLoading] = useState(false);

	const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>(
		[],
	);
	const [userLeaderboardData, setUserLeaderboardData] = useState<
		LeaderboardData[]
	>([]);

	const [game, setGame] = useState<Game | null>(null);

	const fetchCurrentLeaderBoard = useCallback(async (): Promise<
		LeaderboardData[]
	> => {
		const response = await fetch('/api/leaderboard/top', {
			method: 'GET',
		});

		if (!response.ok) {
			return []
		}

		return await response.json();
	}, []);

	const fetchCurrentUserLeaderBoard = useCallback(async (): Promise<
		LeaderboardData[]
	> => {
		const response = await fetch('/api/user/leaderboard', {
			method: 'GET',
		});

		if (!response.ok) {
			return []
		}

		return await response.json();
	}, []);

	const fetchCurrentGame = useCallback(async () => {
		console.log()
		const response: Response | null = await fetch('/api/game/current', {
			method: 'GET',
		});

		if (!response.ok) {
			setGame(null)
			return;
		}

		const game: Game | null = await response.json();

		setGame(game)
	}, []);

	useEffect(() => {
		setLeaderboardLoading(true);

		fetchCurrentLeaderBoard().then((leaderBoardData) => {
			setLeaderboardData(leaderBoardData);
			setLeaderboardLoading(false);
		});
	}, [fetchCurrentLeaderBoard]);

	useEffect(() => {
		setUserLeaderboardLoading(true);

		fetchCurrentUserLeaderBoard().then((leaderBoardData) => {
			setUserLeaderboardData(leaderBoardData);
			setUserLeaderboardLoading(false);
		});
	}, [fetchCurrentUserLeaderBoard]);

	useEffect(() => {
		fetchCurrentGame();
	}, [fetchCurrentGame]);

	const navigate = async () => {
		if (!isAuth) {
			redirect('/login');

			return;
		}

		if (canUserPlay && game) {
			await removeUserGameCoin();
			await fetchUser();

			redirect(`/game?name=${game.name}`);
		}
	};

	return (
		<section className="py-20 text-center">
			<h1 className="nes-text is-disabled text-5xl font-bold mb-4">
				Un jour, un score
			</h1>
			<p className="nes-text is-disabled text-xl mb-8">
				Challenge yourself daily with our unique scoring game!
			</p>
			<div className="flex flex-row w-full justify-between pt-10 pl-4 pr-4">
				{leaderboardLoading || !leaderboardData.length ? (
					<div>
						<SpinningText className="text-white">
							Loading • Loading • Loading •
						</SpinningText>
					</div>
				) : (
					<Leaderboard
						leaderBoardData={leaderboardData}
						isCurrentUserMode={false}
						tableTitle={'Classement général'}
					/>
				)}
				<div className="mt-auto mb-auto">
					<Button
						className="relative overflow-hidden"
						size="lg"
						variant="outline"
						onClick={navigate}
						disabled={isAuth && !canUserPlay && !!game}
					>
						<AnimatedGradientText className="text-sm font-medium self-center">
							Jouer
							<BorderBeam duration={8} size={100} />
						</AnimatedGradientText>
						<BorderBeam
							size={40}
							initialOffset={20}
							className="from-transparent via-yellow-500 to-transparent"
							transition={{
								type: 'spring',
								stiffness: 60,
								damping: 20,
							}}
						/>
					</Button>
				</div>
				{userLeaderboardLoading || !leaderboardData.length ? (
					<div>
						<SpinningText className="text-white">
							Loading • Loading • Loading •
						</SpinningText>
					</div>
				) : (
					<Leaderboard
						leaderBoardData={userLeaderboardData}
						isCurrentUserMode={true}
						tableTitle={'Classement personnel'}
					/>
				)}
			</div>
		</section>
	);
}
