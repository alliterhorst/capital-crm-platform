import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';

@Entity('client_metrics')
export class ClientMetric {
  @PrimaryColumn({ name: 'client_id' })
  clientId!: string;

  @Column({ type: 'int', default: 0 })
  views!: number;

  @UpdateDateColumn({ name: 'last_viewed_at' })
  lastViewedAt!: Date;

  @OneToOne(() => Client, (client) => client.metric, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client!: Client;
}
