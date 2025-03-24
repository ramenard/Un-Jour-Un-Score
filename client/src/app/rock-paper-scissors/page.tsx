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
import QuestionMark from '@/components/QuestionMark';

enum RockPaperScissorsEnum {
	ROCK = 'rock',
	PAPER = 'paper',
	SCISSORS = 'scissors',
}

export default function RockPaperScissors() {
	const [result, setResult] = useState<RockPaperScissorsEnum | null>(null);
	const [total, setTotal] = useState<number>(0);
	const [isBlinking, setIsBlinking] = useState<boolean>(false);
	const [isFailed, setIsFailed] = useState<boolean>(false);

	useEffect(() => {
		if (!isFailed) {
			return;
		}

		activateConfetti();
	}, [isFailed]);

	const checkResult = useCallback(
		(userChoice: RockPaperScissorsEnum, result: RockPaperScissorsEnum) => {
			if (!result || !userChoice) {
				return;
			}

			setResult(result);

			if (result === userChoice) {
				setTotal(total + 1);

				return;
			}

			setIsFailed(true);
		},
		[total],
	);

	const playGame = useCallback(
		(userChoice: RockPaperScissorsEnum) => {
			setResult(null);
			setIsBlinking(true);
			const questionMarkDiv = document.querySelector('#questionMarkDiv');
			const flipResult = Math.random();

			questionMarkDiv.classList.add('blink');

			const result: RockPaperScissorsEnum =
				flipResult <= 0.33
					? RockPaperScissorsEnum.ROCK
					: flipResult <= 0.66
						? RockPaperScissorsEnum.PAPER
						: RockPaperScissorsEnum.SCISSORS;

			// const result: RockPaperScissorsEnum = RockPaperScissorsEnum.ROCK

			setTimeout(() => {
				questionMarkDiv.classList.remove('blink');
			}, 3500);

			//This timeout is for waiting  for the animation of the flipping coin
			setTimeout(() => {
				setIsBlinking(false);

				checkResult(userChoice, result);
			}, 3500);
		},
		[checkResult],
	);

	const resetData = () => {
		setIsFailed(false);
		setIsBlinking(false);
		setTotal(0);
	};

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
			<div className="pt-42 flex justify-center">
				<div id="questionMarkDiv">
					{result}
					{!result && <QuestionMark />}
					{result === RockPaperScissorsEnum.ROCK && (
						<img
							width="100"
							height="100"
							className="to-white-png"
							src="/rock.png"
							alt="rock"
						/>
					)}
					{result === RockPaperScissorsEnum.PAPER && (
						<img
							width="100"
							height="100"
							className="to-white-png"
							src="/paper.png"
							alt="paper"
						/>
					)}
					{result === RockPaperScissorsEnum.SCISSORS && (
						<img
							width="100"
							height="100"
							className="to-white-png"
							src="/scissors.png"
							alt="scissors"
						/>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-center pt-12">
				<button
					disabled={isBlinking}
					onClick={() => playGame(RockPaperScissorsEnum.ROCK)}
					type="button"
					className="nes-btn is-primary"
				>
					Pierre
				</button>
				<button
					disabled={isBlinking}
					onClick={() => playGame(RockPaperScissorsEnum.PAPER)}
					type="button"
					className="nes-btn is-primary"
				>
					Papier
				</button>
				<button
					disabled={isBlinking}
					onClick={() => playGame(RockPaperScissorsEnum.SCISSORS)}
					type="button"
					className="nes-btn is-primary"
				>
					Ciseaux
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
