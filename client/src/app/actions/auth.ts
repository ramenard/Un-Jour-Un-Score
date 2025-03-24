'use server';

import {
	LoginFormSchema,
	FormState,
	RegisterFormSchema,
} from '@/lib/definitions';
import { CreateUserDto, LoginUserDto } from '@/types/user';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';

export async function login(state: FormState, formData: FormData) {
	// Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	// Call the provider or db to create a user...
	const { email, password } = validatedFields.data;
	const loginUserDto: LoginUserDto = { email: email, password: password };
	const token = await loginUser(loginUserDto);
	await createSession(token);
	redirect('/');
}

export async function register(state: FormState, formData: FormData) {
	const validatedFields = RegisterFormSchema.safeParse({
		name: formData.get('name'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = validatedFields.data;
	const createUserDto: CreateUserDto = {
		username: name,
		email: email,
		password: password,
	};
	const token = await createUser(createUserDto);
	await createSession(token);
	redirect('/');
}

export async function logout() {
	await deleteSession();
	redirect('/');
}

const createUser = async (createUserDto: CreateUserDto) => {
	const res = await fetch('http://127.0.0.1:3001/security/register', {
		method: 'post',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(createUserDto),
	});
	return res.json();
};

const loginUser = async (loginUserDto: LoginUserDto) => {
	const res = await fetch('http://127.0.0.1:3001/security/login', {
		method: 'post',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(loginUserDto),
	});
	return res.json();
};
