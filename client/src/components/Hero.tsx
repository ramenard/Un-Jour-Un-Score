'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { SpinningText } from '@/components/magicui/spinning-text';
import { LeaderboardData } from '@/types/leaderboard';
import Leaderboard from '@/components/Leaderboard';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useAuth } from '@/context/AuthContext';
import { redirect } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { UpdateUserDto } from '@/types/user';

export default function Hero() {
	const { isAuth } = useAuth();
    const { user, canUserPlay, fetchUser } = useUser()

	const [leaderboardLoading, setLeaderboardLoading] = useState(false);
	const [userLeaderboardLoading, setUserLeaderboardLoading] = useState(false);

	const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>(
		[],
	);
	const [userLeaderboardData, setUserLeaderboardData] = useState<
		LeaderboardData[]
	>([]);

	useEffect(() => {
		setLeaderboardLoading(true);

		fetchCurrentLeaderBoard().then((leaderBoardData) => {
			setLeaderboardData(leaderBoardData);
			setLeaderboardLoading(false);
		});
	}, []);

	useEffect(() => {
		setUserLeaderboardLoading(true);

		fetchCurrentUserLeaderBoard().then((leaderBoardData) => {
			setUserLeaderboardData(leaderBoardData);
			setUserLeaderboardLoading(false);
		});
	}, []);

	const fetchCurrentLeaderBoard = async (): Promise<LeaderboardData[]> => {
		const response = await fetch('/api/leaderboard/top', {
			method: 'GET',
		});

		return await response.json();
	};

	const fetchCurrentUserLeaderBoard = async (): Promise<
		LeaderboardData[]
	> => {
		const response = await fetch('/api/user/leaderboard', {
			method: 'GET',
		});

		return await response.json();
	};

    const updateUserGameCoin = async (): Promise<void> => {
        if (!user) {
            return;
        }

        const updateUserDto: UpdateUserDto = { gameCoins: user.gameCoins - 1}
        await fetch('/api/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateUserDto),
        });
    }

    const navigate = async () => {
        if (!isAuth) {
            redirect('/login')

            return;
        }

        if (canUserPlay) {
            await updateUserGameCoin()
            await fetchUser()

            redirect('/game')
        }
    }

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
					<SpinningText className="text-white">
						Loading • Loading • Loading •
					</SpinningText>
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
                        disabled={isAuth && !canUserPlay}
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
					<SpinningText className="text-white">
						Loading • Loading • Loading •
					</SpinningText>
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
