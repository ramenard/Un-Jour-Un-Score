'use client'

import { login } from '@/app/actions/auth'
import {useActionState, useState} from 'react'

export default function LoginForm() {
    const [state, action, pending] = useActionState(login, undefined)
    const [password, setPassword] = useState<string>('')
    const[email, setEmail] = useState<string>('')

    return (
        <form action={action} className="nes-theme nes-text is-disabled">
            <div className="nes-field my-3">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" name="email" placeholder="Email" className="nes-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            {state?.errors?.email && <p>{state.errors.email}</p>}

            <div className="nes-field my-3">
                <label htmlFor="password">Mot de passe</label>
                <input id="password" name="password" type="password" className="nes-input" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            {state?.errors?.password && (
                <div>
                    <p>Le mot de passe doit:</p>
                    <ul>
                        {state.errors.password.map((error) => (
                            <li key={error}>- {error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <button disabled={pending} type="submit" className="nes-btn is-success my-5">
                Se connecter
            </button>
        </form>
    )
}