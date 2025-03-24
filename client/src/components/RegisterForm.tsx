'use client';

import { register } from '@/app/actions/auth';
import { useActionState, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import type { RegisterFormState } from '@/lib/definitions';

export default function RegisterForm() {
	const { refreshAuth } = useAuth();
	const router = useRouter();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const initialState: RegisterFormState = {
		errors: {},
		success: false,
		message: '',
	};

	const [state, action, pending] = useActionState(
		async (
			prevState: RegisterFormState,
			formData: FormData,
		): Promise<RegisterFormState> => {
			const result = await register(prevState, formData);

			if (result?.success) {
				await refreshAuth();
				router.push('/');
			}

			return result || initialState;
		},
		initialState,
	);

	return (
		<form action={action} className="nes-theme nes-text is-disabled">
			<div className="nes-field my-3">
				<label htmlFor="username">Nom d&#39;utilisateur</label>
				<input
					id="username"
					name="username"
					type="text"
					className="nes-input"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</div>
			{state.errors?.username && <p>{state.errors.username[0]}</p>}

			<div className="nes-field my-3">
				<label htmlFor="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					className="nes-input"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			{state.errors?.email && <p>{state.errors.email[0]}</p>}

			<div className="nes-field my-3">
				<label htmlFor="password">Mot de passe</label>
				<input
					id="password"
					name="password"
					type="password"
					className="nes-input"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			{state.errors?.password && (
				<div>
					<p>Le mot de passe doit :</p>
					<ul>
						{state.errors.password.map((error) => (
							<li key={error}>- {error}</li>
						))}
					</ul>
				</div>
			)}

			<button
				disabled={pending}
				type="submit"
				className="nes-btn is-success my-5"
			>
				S&#39;inscrire
			</button>
		</form>
	);
}
