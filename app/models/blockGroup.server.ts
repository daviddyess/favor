import type { DocumentSelector } from 'arangojs/documents';
import { aql, db } from '../modules/arango';
import { getLogger } from 'logade';
import type { BlockGroupInput } from '~/interfaces/BlockGroup';

const log = getLogger('Users Query');
const blockGroups = db.collection('blockGroups');

export async function createBlockGroup({
  description,
  name,
  status,
  title
}: BlockGroupInput) {
  const blockGroup = await blockGroups.save(
    {
      description,
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

export async function updateBlockGroup({
  id,
  description,
  name,
  status,
  title
}: BlockGroupInput) {
  const data = {
    description,
    name,
    status,
    title
  };

  const blockGroup = await blockGroups.update(id as DocumentSelector, data, {
    returnNew: true
  });

  blockGroup.new.id = await blockGroup.new._key;

  return blockGroup.new;
}

export async function getBlockGroup(id: string) {
  try {
    const blockGroup = await db.query(
      aql`
    FOR blockGroup IN ${blockGroups}
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

export async function getBlockGroups() {
  try {
    const blockGroup = await db.query(
      aql`
    FOR blockGroup IN ${blockGroups}
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

export async function getBlockGroupOptions(blockGroupId: string) {
  try {
    const blockGroupQuery = await db.query(aql`
          FOR blockGroup IN ${blockGroups}
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
