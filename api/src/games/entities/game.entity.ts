import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description?: string;

  @Column({ default: false, type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'datetime', default: null })
  lastActiveDate: Date | null;

  @Column({ default: false, type: 'boolean' })
  isReady: boolean;

  @Column()
  imagePath?: string;
}
