import 'server-only'

import {cookies} from 'next/headers'
import {decrypt} from '@/lib/session'
import {redirect} from "next/navigation";
import {cache} from "react";
import {UserSession} from "@/types/user";
import {isString} from "@/utils/assert";


export const verifySession = cache(async (): Promise<{ isAuth: boolean, user: UserSession }> => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.id) {
        redirect('/login')
    }

    if (!isString(session.id) ||
        !isString(session.username) ||
        !isString(session.role)) {
            redirect('/login')
    }

    return {isAuth: true, user: {id: session.id, username: session.username, role: session.role}}
})
