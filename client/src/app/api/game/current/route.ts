import { NextResponse} from 'next/server';
import {Game} from "@/types/game";
import {getCurrentGame} from "@/app/actions/game";

export async function GET() {
  try {
    const currentGame: Game = await getCurrentGame();

    return NextResponse.json(currentGame);
  } catch {
    return null
  }
}
