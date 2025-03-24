import type React from 'react';
import RegisterForm from '@/components/RegisterForm';

export default function Register() {
	return (
		<div className="nes-theme min-h-screen w-full flex justify-center">
			<div className="container w-1/4 my-28">
				<RegisterForm />
			</div>
		</div>
	);
}
