import { aql, db } from '../modules/arango';
import { getLogger } from 'logade';
import type { BlockTypeInput } from '~/interfaces/BlockType';
import { timeStamp } from '~/modules/utils';

const log = getLogger('Users Query');
const blockTypes = db.collection('blockTypes');

export async function createBlockType({
  description,
  name,
  options = {},
  title
}: BlockTypeInput) {
  const blockType = await blockTypes.save(
    {
      createdAt: timeStamp(),
      description,
      name,
      options,
      title
    },
    {
      returnNew: true
    }
  );

  blockType.new.id = await blockType.new._key;

  return blockType.new;
}

export async function updateBlockType({
  id,
  description,
  name,
  options = {},
  title
}: BlockTypeInput) {
  const data = {
    description,
    name,
    options,
    title,
    updatedAt: timeStamp()
  };

  const blockType = await blockTypes.update(id, data, {
    returnNew: true
  });

  blockType.new.id = await blockType.new._key;

  return blockType.new;
}

export async function getBlockType(id: string) {
  try {
    const blockType = await db.query(
      aql`
    FOR blockType IN ${blockTypes}
      FILTER blockType._key == ${id}
      LIMIT 1
      RETURN blockType
  `
    );

    return await blockType.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getBlockTypes() {
  try {
    const blockType = await db.query(
      aql`
    FOR blockType IN ${blockTypes}
      SORT blockType.name
      RETURN MERGE(blockType, {"id": blockType._key})
  `,
      { fullCount: true }
    );

    const totalCount = await blockType?.extra?.stats?.fullCount;
    const nodes = await blockType.all();

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

export async function getBlockTypeOptions(blockTypeId: string) {
  try {
    const blockTypeQuery = await db.query(aql`
          FOR blockType IN ${blockTypes}
            FILTER blockType._key == ${blockTypeId}
            LIMIT 1
            RETURN blockType.options
        `);
    return await blockTypeQuery.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
