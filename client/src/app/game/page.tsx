'use client';

import './style.css';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useUser } from '@/context/UserContext';
import { redirect } from 'next/navigation';
import { Leaderboard } from '@/types/leaderboard';
import { Has_played } from '@/types/has_played';

enum CoinFlipSide {
	HEAD = 'heads',
	TAIL = 'tails',
}

export default function Game() {
	const [total, setTotal] = useState<number>(0);
	const [isFlipping, setIsFlipping] = useState<boolean>(false);
	const [isFailed, setIsFailed] = useState<boolean>(false);

	const hasRun = useRef(false);

	const { canUserPlay, removeUserGameCoin } = useUser();

	const resetData = useCallback(() => {
		setIsFailed(false);
		setIsFlipping(false);
		setTotal(0);
	}, []);

	const saveData = useCallback(async () => {
		const score: { score: number } = { score: total };

		await fetch('/api/user/score', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(score),
		});
	}, [total]);

	const fetchCurrentLeaderboard = useCallback(async () => {
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
			fetchCurrentLeaderboard();
		}

	}, [fetchCurrentLeaderboard]);

	const checkResult = useCallback(
		(userChoice: CoinFlipSide, result: CoinFlipSide) => {
			if (!result || !userChoice) {
				return;
			}

			if (result === userChoice) {
				setTotal(total + 1);

				return;
			}

			setIsFailed(true);
			saveData();
		},
		[total, saveData],
	);

	const fetchLeaderboard = async () => {
		const leaderboardResponse = await fetch('/api/leaderboard/current', {
			method: 'GET',
		});

		return leaderboardResponse.json();
	};

	const fetchHasPlayed = async (leaderboardId: string) => {
		const hasPlayedResponse = await fetch(
			`/api/has_played/current?leaderboardId=${leaderboardId}`,
			{
				method: 'GET',
			},
		);

		return hasPlayedResponse.json();
	};

	const createHasPlayed = async () => {
		const hasPlayedCreateResponse = await fetch(`/api/has_played/create`, {
			method: 'POST',
		});

		return hasPlayedCreateResponse.json();
	};

	const flipCoin = useCallback(
		(userChoice: CoinFlipSide) => {
			setIsFlipping(true);

			const coin = document.querySelector('#coin');
			const flipResult = Math.random();

			if (!coin) {
				return;
			}

			coin.classList.remove(CoinFlipSide.TAIL);
			coin.classList.remove(CoinFlipSide.HEAD);

			const result: CoinFlipSide =
				flipResult <= 0.5 ? CoinFlipSide.HEAD : CoinFlipSide.TAIL;

			setTimeout(() => {
				coin.classList.add(result);
			}, 100);

			//This timeout is for waiting  for the animation of the flipping coin
			setTimeout(() => {
				setIsFlipping(false);

				checkResult(userChoice, result);
			}, 3500);
		},
		[checkResult],
	);

	const replay = useCallback(async () => {
		await removeUserGameCoin();
	}, [removeUserGameCoin]);

	const activateConfetti = useCallback(() => {
		const duration = 5 * 1000;
		const animationEnd = Date.now() + duration;
		const defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 0,
		};

		const randomInRange = (min: number, max: number) =>
			Math.random() * (max - min) + min;

		const interval = window.setInterval(() => {
			const timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			const particleCount = 50 * (timeLeft / duration);
			confetti({
				...defaults,
				particleCount,
				zIndex: 51,
				origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
			});

			confetti({
				...defaults,
				particleCount,
				zIndex: 51,
				origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
			});
		}, 250);
	}, []);

	useEffect(() => {
		console.log('failed')
		if (!isFailed) {
			return;
		}

		activateConfetti();
	}, [isFailed, activateConfetti]);

	return (
		<div className="nes-theme min-h-screen">
			<div className="pt-42">
				<div id="coin">
					<div className="side-a">
						<img src="/head_coin.png" alt="head coin" />
					</div>
					<div className="side-b">
						<img src="/tail_coin.png" alt="tail coin" />
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-center pt-12">
				<button
					disabled={isFlipping}
					onClick={() => flipCoin(CoinFlipSide.TAIL)}
					type="button"
					className="nes-btn is-primary"
				>
					Pile
				</button>
				<button
					disabled={isFlipping}
					onClick={() => flipCoin(CoinFlipSide.HEAD)}
					type="button"
					className="nes-btn is-primary"
				>
					Face
				</button>
			</div>

			<div className="flex justify-center text-white pt-2">
				Score: {total}
			</div>

			<Dialog
				open={isFailed}
				onOpenChange={(open) => !open && resetData()}
			>
				<DialogContent
					onInteractOutside={(e) => {
						e.preventDefault();
					}}
					className="sm:max-w-md nes-theme"
				>
					<DialogHeader>
						<DialogTitle>Partie Terminée</DialogTitle>
						<DialogDescription>
							Votre score: {total}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter
						className={
							canUserPlay
								? '!justify-between flex flex-row'
								: '!justify-center flex flex-row'
						}
					>
						<div className="self-start">
							<DialogClose asChild>
								<Button
									type="button"
									variant="secondary"
									onClick={() => redirect('/')}
								>
									Retour au menu
								</Button>
							</DialogClose>
						</div>
						{canUserPlay && (
							<div>
								<DialogClose asChild>
									<Button
										type="button"
										variant="secondary"
										onClick={replay}
									>
										Rejouer
									</Button>
								</DialogClose>
							</div>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
