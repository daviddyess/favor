import { aql, db } from '../modules/arango';
import { getLogger } from 'logade';

const log = getLogger('Users Query');
const articleTypes = db.collection('articleTypes');

export async function getArticleType(id: string) {
  try {
    const articleType = await db.query(
      aql`
    FOR articleType IN ${articleTypes}
      FILTER articleType._key == ${id}
      LIMIT 1
      RETURN articleType
  `
    );

    return await articleType.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}

export async function getArticleTypes() {
  try {
    const articleType = await db.query(
      aql`
    FOR articleType IN ${articleTypes}
      SORT articleType.name
      RETURN MERGE(articleType, {"id": articleType._key})
  `,
      { fullCount: true }
    );

    const totalCount = await articleType?.extra?.stats?.fullCount;
    const nodes = await articleType.all();

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

export async function getArticleTypeOptions(articleTypeId: string) {
  try {
    const articleTypeQuery = await db.query(aql`
          FOR articleType IN ${articleTypes}
            FILTER articleType._key == ${articleTypeId}
            LIMIT 1
            RETURN articleType.options
        `);
    return await articleTypeQuery.next();
  } catch (error: any) {
    log.error(error.message);
    log.error(error.stack);
    throw error;
  }
}
