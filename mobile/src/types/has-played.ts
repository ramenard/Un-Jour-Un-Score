export type HasPlayed = {
  id: string;
  position: number;
  score: number;
  tries: number;
};

export type CreateHasPlayedDto = {
  userId: string;
};
