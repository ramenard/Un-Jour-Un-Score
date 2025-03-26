import { User } from '@/types/user';
import { Game } from '@/types/game';

export type Has_played = {
	id: string;
	position: number;
	score: number;
	tries: number;
	user: User;
	game: Game;
};
