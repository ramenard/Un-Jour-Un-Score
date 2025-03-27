'use client';

import React, { useEffect } from 'react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { useUser } from '@/context/UserContext';

const Profil: React.FC = () => {
	const { user, fetchUser } = useUser();

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	if (!user) {
		return <div>Loading...</div>;
	}

	return (
		<div className="nes-theme min-h-screen flex flex-col items-center">
			<div
				className="nes-container"
				style={{ maxWidth: '70rem', width: '100%' }}
			>
				<p className="title text-white">Profil de {user.username}</p>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<i
						className="nes-bcrikko"
						style={{ marginRight: '16px' }}
					></i>
					<div>
						<section className="message-list">
							<section className="message -left">
								<div className="nes-balloon from-left">
									<p>
										Hello ! Mon pseudo c&#39;est{' '}
										{user.username} !
									</p>
								</div>
							</section>

							<section className="message -left">
								<div className="nes-balloon from-left">
									<p>Mon email est {user.email}</p>
								</div>
							</section>

							<section className="message -left">
								<div className="nes-balloon from-left">
									<p>
										Pièces de jeu : {user.gameCoins} |
										Pièces premium : {user.premiumCoins}
									</p>
								</div>
							</section>
						</section>
					</div>
				</div>
				<BorderBeam
					duration={6}
					size={600}
					className="from-transparent via-red-500 to-transparent"
				/>
				<BorderBeam
					duration={6}
					delay={3}
					size={600}
					className="from-transparent via-blue-500 to-transparent"
				/>
			</div>
		</div>
	);
};

export default Profil;
