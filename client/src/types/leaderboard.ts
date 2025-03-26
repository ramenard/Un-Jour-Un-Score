export type Leaderboard = {
	id: string;
	game: number;
	playDate: Date;
	isClosed: boolean;
};

export type LeaderboardData = {
	username: string;
	score: number;
	rankScore: string;
};
