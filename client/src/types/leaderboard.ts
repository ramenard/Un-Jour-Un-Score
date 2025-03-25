export type Leaderboard = {
	leaderboard_id: number;
	game_id_fk: number;
	playDate: Date;
	isClosed: boolean;
};

export type LeaderboardData = {
	username: string;
	score: number;
	rankScore: string;
};
