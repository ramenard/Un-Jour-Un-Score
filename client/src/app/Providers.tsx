'use client';

import { AuthProvider } from '@/context/AuthContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	console.log('Providers mounted'); // DEBUG
	return <AuthProvider>{children}</AuthProvider>;
}
