import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Service } from './service.entity';
import { Seat } from './seat.entity';

@Entity()
export class Bus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  busType: string;

  @Column()
  numberPlate: string;

  @ManyToOne(() => Service, (service) => service.buses)
  service: Service;

  @OneToMany(() => Seat, (seat) => seat.bus)
  seats: Seat[];
}
