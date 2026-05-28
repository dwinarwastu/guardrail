import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdentifierType } from '../enums/identifier-type.enum';
import { RuleStatus } from '../enums/rule-status.enum';

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resource: string;

  @Column({ type: 'enum', enum: IdentifierType })
  identifierType: IdentifierType;

  @Column()
  limit: number;

  @Column()
  windowSizeSeconds: number;

  @Column({ type: 'enum', enum: RuleStatus, default: RuleStatus.ACTIVE })
  status: RuleStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
