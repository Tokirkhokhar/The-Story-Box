import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { generateKSUID } from './database.helper';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  protected abstract idPrefix: string;

  @BeforeUpdate()
  removeIdPrefixBeforeUpdate() {
    if (Object.hasOwn(this, 'idPrefix')) {
      Object.defineProperty(this, 'idPrefix', {
        value: undefined,
        enumerable: false,
        writable: true,
      });
    }
  }

  @BeforeInsert()
  async generateUniqueId() {
    if (!this.id) {
      this.id = await generateKSUID(this.idPrefix);
    }
  }

  @AfterLoad()
  removeIdPrefix() {
    if (Object.hasOwn(this, 'idPrefix')) {
      Object.assign(this, { idPrefix: undefined });
    }
  }
}
