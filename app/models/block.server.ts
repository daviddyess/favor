import type { DocumentSelector } from 'arangojs/documents';
import { aql, db } from '../modules/arango';
import { getLogger } from 'logade';
import type { BlockInput } from '~/interfaces/Block';

const log = getLogger('Blocks Query');
const blocks = db.collection('blocks');

export async function createBlock({ name, status, title }: BlockInput) {
  const blockGroup = await blocks.save(
    {
      name,
      status,
      title
    },
    {
      returnNew: true
    }
  );

  blockGroup.new.id = await blockGroup.new._key;

  return blockGroup.new;
}

export async function updateBlock({ id, name, status, title }: BlockInput) {
  const data = {
    name,
    status,
    title
  };

  const blockGroup = await blocks.update(id as DocumentSelector, data, {
    returnNew: true
  });

  blockGroup.new.id = await blockGroup.new._key;

  return blockGroup.new;
}

export async function getBlock(id: string) {
  try {
    const blockGroup = await db.query(
      aql`
    FOR blockGroup IN ${blocks}
      FILTER blockGroup._key == ${id}
      LIMIT 1
      RETURN blockGroup
  `
    );

    return await blockGroup.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getBlocks() {
  try {
    const blockGroup = await db.query(
      aql`
    FOR blockGroup IN ${blocks}
      SORT blockGroup.name
      RETURN MERGE(blockGroup, {"id": blockGroup._key})
  `,
      { fullCount: true }
    );

    const totalCount = await blockGroup?.extra?.stats?.fullCount;
    const nodes = await blockGroup.all();

    return {
      count: nodes.length,
      totalCount,
      nodes
    };
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getBlockOptions(blockGroupId: string) {
  try {
    const blockGroupQuery = await db.query(aql`
          FOR blockGroup IN ${blocks}
            FILTER blockGroup._key == ${blockGroupId}
            LIMIT 1
            RETURN blockGroup.options
        `);
    return await blockGroupQuery.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
