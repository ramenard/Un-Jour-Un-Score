import {NextRequest, NextResponse} from 'next/server';
import { Leaderboard } from '@/types/leaderboard';
import { getHasPlayedByUserAndLeaderboard } from '@/app/actions/has_played';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leaderboardId = searchParams.get('leaderboardId');

	const currentLeaderBoard: Leaderboard =
		await getHasPlayedByUserAndLeaderboard(leaderboardId);

	return NextResponse.json(currentLeaderBoard);
}
