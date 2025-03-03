import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Leaderboard } from '../../leaderboards/entities/leaderboard.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class HasPlayed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  position: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  tries: number;

  @ManyToOne(() => User, (user) => user.hasPlayed)
  user: User;

  @ManyToOne(() => Leaderboard, (leaderboard) => leaderboard.hasPlayed)
  leaderboard: Leaderboard;
}
