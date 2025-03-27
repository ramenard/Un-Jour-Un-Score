'use client';

import { AuthProvider } from '@/context/AuthContext';
import React from 'react';
import { UserProvider } from '@/context/UserContext';

export function Providers({ children }: { children: React.ReactNode }) {
	console.log('Providers mounted');
	return (
		<AuthProvider>
			<UserProvider>{children}</UserProvider>
		</AuthProvider>
	);
}
