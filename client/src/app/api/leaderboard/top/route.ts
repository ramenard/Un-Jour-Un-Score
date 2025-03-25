import { NextResponse } from 'next/server';
import { LeaderboardData } from '@/types/leaderboard';
import { getTopLeaderboard } from '@/app/actions/leaderboard';

export async function GET() {
	console.log('get oe');
	const currentLeaderBoard: LeaderboardData[] = await getTopLeaderboard();

	return NextResponse.json(currentLeaderBoard);
}
