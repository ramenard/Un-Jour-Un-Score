import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { HasPlayed } from '../../has-played/entities/has-played.entity';

@Entity()
export class Leaderboard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, (game) => game.leaderboards)
  game: Game;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  playDate: Date;

  @Column({ type: 'boolean', default: false })
  isClosed: boolean;

  @OneToMany(() => HasPlayed, (hasPlayed) => hasPlayed.leaderboard)
  hasPlayed: HasPlayed[];
}
