export type Leaderboard = {
  id: string;
  game: string | { id: string; name: string };
  playDate: string;
  isClosed: boolean;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
  position: number;
};
