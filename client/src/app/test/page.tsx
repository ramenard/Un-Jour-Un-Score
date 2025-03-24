'use client';

import type React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Test() {
	const { userId, userRole } = useAuth();

	return (
		<div className="nes-theme min-h-screen">
			<p className="nes-text is-disabled">
				Mon id est {userId} et mon role {userRole}
			</p>
		</div>
	);
}
