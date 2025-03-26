'use server';

import {
	LoginFormSchema,
	LoginFormState,
	RegisterFormSchema,
	RegisterFormState,
} from '@/lib/definitions';

import { CreateUserDto, LoginUserDto } from '@/types/user';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '@/lib/session';

export async function login(
	prevState: LoginFormState,
	formData: FormData,
): Promise<LoginFormState> {
	// Validate form fields
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	// If any form fields are invalid, return early
	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	// Call the provider or db to create a user...
	const { email, password } = validatedFields.data;

	const loginUserDto: LoginUserDto = {
		email: email,
		password: password,
	};

	const token = await loginUser(loginUserDto);
	await createSession(token.access_token);

	return { success: true };
}

export async function register(
	prevState: RegisterFormState,
	formData: FormData,
): Promise<RegisterFormState> {
	const validatedFields = RegisterFormSchema.safeParse({
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			success: false,
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { username, email, password } = validatedFields.data;

	const createUserDto: CreateUserDto = {
		username: username,
		email: email,
		password: password,
	};

	const token = await createUser(createUserDto);
	await createSession(token.access_token);

	return { success: true };
}

export async function logoutServer() {
	await deleteSession();
	redirect('/');
}

const createUser = async (createUserDto: CreateUserDto) => {
	const res = await fetch(`${process.env.API_URL}${process.env.API_PORT}/security/register`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(createUserDto),
	});
	return res.json();
};

const loginUser = async (loginUserDto: LoginUserDto) => {
	const res = await fetch(`${process.env.API_URL}${process.env.API_PORT}/security/login`, {
		method: 'post',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(loginUserDto),
	});
	return res.json();
};
