import { NextResponse } from 'next/server';
import { LeaderboardData } from '@/types/leaderboard';
import { getCurrentUserLeaderboard } from '@/app/actions/user';

export async function GET() {
	const currentUserLeaderBoard: LeaderboardData[] =
		await getCurrentUserLeaderboard();

	return NextResponse.json(currentUserLeaderBoard);
}
