import {NextResponse} from 'next/server';
import {createHasPlayedForCurrentUser} from '@/app/actions/has_played';

export async function POST() {
  try {
    await createHasPlayedForCurrentUser();

    return NextResponse.json({ error: '' });
  } catch {
    return NextResponse.json({ error: 'Something went wrong' });
  }
}
