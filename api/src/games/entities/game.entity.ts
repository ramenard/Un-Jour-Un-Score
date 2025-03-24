import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Leaderboard } from '../../leaderboards/entities/leaderboard.entity';

@Entity()
export class Game {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description?: string;

	@OneToMany(() => Leaderboard, (leaderboard) => leaderboard.game)
	leaderboards: Leaderboard[];

	@Column({ default: false, type: 'boolean' })
	isActive: boolean;

	@Column({ type: 'datetime', default: null })
	lastActiveDate: Date | null;

	@Column({ default: false, type: 'boolean' })
	isReady: boolean;

	@Column()
	imagePath?: string;
}
