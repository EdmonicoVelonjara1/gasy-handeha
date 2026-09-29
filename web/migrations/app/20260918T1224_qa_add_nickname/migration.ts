#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6fe77952831ac9a891c4c9f45051cc99314d08921a06e875efd2a31e9f6a503f/contract';
import startContract from '../../snapshots/6fe77952831ac9a891c4c9f45051cc99314d08921a06e875efd2a31e9f6a503f/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/fe673e4b21e588c8c13abded4ffa4e7e186bd076c987bcad624700014a9305bf/contract';
import endContract from '../../snapshots/fe673e4b21e588c8c13abded4ffa4e7e186bd076c987bcad624700014a9305bf/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('nickname', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
