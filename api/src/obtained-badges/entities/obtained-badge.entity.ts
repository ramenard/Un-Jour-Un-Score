import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Badge } from '../../badges/entities/badge.entity';

@Entity()
export class ObtainedBadge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.obtainedBadges)
  user: User;

  @ManyToOne(() => Badge, (badge) => badge.obtainedBadges)
  badge: Badge;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  obtainingDate: Date;
}
