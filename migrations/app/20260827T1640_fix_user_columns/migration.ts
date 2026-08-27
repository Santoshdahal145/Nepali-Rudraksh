#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/019109d8c353e7651a04b5c7b78c9ca9db9c42fdf6193166354bbc7779364873/contract';
import endContract from '../../snapshots/019109d8c353e7651a04b5c7b78c9ca9db9c42fdf6193166354bbc7779364873/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/1e8412e162dbbe69f4bb3bf8d07f0280ae67eaab15c34dcf201e67468315428d/contract';
import startContract from '../../snapshots/1e8412e162dbbe69f4bb3bf8d07f0280ae67eaab15c34dcf201e67468315428d/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropTable({ schema: 'public', table: 'post' }),
      this.dropColumn({ schema: 'public', table: 'user', column: 'name' }),
      this.dropColumn({ schema: 'public', table: 'user', column: 'username' }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('firstName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('lastName', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('password', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('phoneNumber', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
