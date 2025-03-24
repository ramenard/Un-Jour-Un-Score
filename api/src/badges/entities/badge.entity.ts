import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ObtainedBadge } from '../../obtained-badges/entities/obtained-badge.entity';

@Entity()
export class Badge {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	description?: string;

	@Column()
	imagePath?: string;

	@OneToMany(() => ObtainedBadge, (obtainedBadge) => obtainedBadge.badge)
	obtainedBadges: ObtainedBadge[];
}
