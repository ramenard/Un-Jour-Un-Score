import { z } from 'zod';

export const LoginFormSchema = z.object({
	email: z
		.string()
		.email({ message: "Merci d'entrer un email valide." })
		.trim(),
	password: z
		.string()
		.min(8, { message: "Etre d'au moins 8 caractères." })
		.regex(/[a-zA-Z]/, { message: 'Contenir au moins 1 lettre.' })
		.regex(/[0-9]/, { message: 'Contenir au moins 1 chiffre.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contenir au moins 1 caractère spécial.',
		})
		.trim(),
});

export const RegisterFormSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Le nom doit être d'au moins 2 caractères." })
		.trim(),
	email: z
		.string()
		.email({ message: "Merci d'entrer un email valide." })
		.trim(),
	password: z
		.string()
		.min(8, { message: "Etre d'au moins 8 caractères." })
		.regex(/[a-zA-Z]/, { message: 'Contenir au moins 1 lettre.' })
		.regex(/[0-9]/, { message: 'Contenir au moins 1 chiffre.' })
		.regex(/[^a-zA-Z0-9]/, {
			message: 'Contenir au moins 1 caractère spécial.',
		})
		.trim(),
});

export type FormState =
	| {
			errors?: {
				name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;
