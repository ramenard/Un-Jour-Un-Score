'use client'

import { register } from '@/app/actions/auth'
import {useActionState, useState} from 'react'

export default function RegisterForm() {
    const [state, action, pending] = useActionState(register, undefined)
    const [userName, setUserName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const[email, setEmail] = useState<string>('')

    return (
        <form action={action} className="nes-theme nes-text is-disabled">
            <div className="nes-field my-3">
                <label htmlFor="name">Nom d&#39;utilisateur</label>
                <input id="name" name="name" type="text" placeholder="Nom d'utilisateur" className="nes-input" value={userName} onChange={(e) => setUserName(e.target.value)}/>
            </div>
            {state?.errors?.name && <p>{state.errors.name}</p>}

            <div className="nes-field my-3">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" className="nes-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
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
                S&#39;inscrire
            </button>
        </form>
    )
}