'use client';

import './style.css';
import { useCallback, useEffect, useState } from 'react';
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
import { UpdateUserDto } from '@/types/user';

enum CoinFlipSide {
	HEAD = 'heads',
	TAIL = 'tails',
}

export default function Game() {
	const [total, setTotal] = useState<number>(0);
	const [isFlipping, setIsFlipping] = useState<boolean>(false);
	const [isFailed, setIsFailed] = useState<boolean>(false);

    const { user } = useUser()

	useEffect(() => {
		if (!isFailed) {
			return;
		}

		activateConfetti();
	}, [isFailed]);

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
            saveData()
		},
		[total],
	);

	const flipCoin = useCallback(
		(userChoice: CoinFlipSide) => {
			setIsFlipping(true);

			const coin = document.querySelector('#coin');
			const flipResult = Math.random();

            if(!coin) {
                return
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

	const resetData = () => {
		setIsFailed(false);
		setIsFlipping(false);
		setTotal(0);
	};

    const saveData = async () => {
        console.log('saveData');
        const score: { score: number } = { score: total }

        console.log('score page', score);

        await fetch('/api/user/score', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(score),
        });
    }

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
	});

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
				<DialogContent className="sm:max-w-md nes-theme">
					<DialogHeader>
						<DialogTitle>Partie Terminée</DialogTitle>
						<DialogDescription>
							Votre score: {total}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="secondary">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
