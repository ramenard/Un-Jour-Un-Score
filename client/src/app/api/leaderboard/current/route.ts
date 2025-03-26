import { NextResponse } from 'next/server';
import { Leaderboard } from '@/types/leaderboard';
import {
	getCurrentLeaderboard,
} from '@/app/actions/leaderboard';

export async function GET() {
  const currentLeaderBoard: Leaderboard = await getCurrentLeaderboard();

  return NextResponse.json(currentLeaderBoard);
}
