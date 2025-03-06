import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ObtainedBadge } from '../../obtained-badges/entities/obtained-badge.entity';
import { HasPlayed } from '../../has-played/entities/has-played.entity';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export interface UserLeaderBoard {
  username: string;
  score: number;
  position: number;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ default: 0 })
  gameCoins: number;

  @Column({ default: 0 })
  premiumCoins: number;

  @Column({ default: 0 })
  freeCoins: number;

  @OneToMany(() => ObtainedBadge, (obtainedBadge) => obtainedBadge.user)
  obtainedBadges: ObtainedBadge[];

  @OneToMany(() => HasPlayed, (hasPlayed) => hasPlayed.user)
  hasPlayed: HasPlayed[];
}
