import { aql, db } from '../modules/arango';
import { getLogger } from 'logade';
import type { ArticleTypeInput } from '~/interfaces/ArticleType';
import { formatSlug, timeStamp } from '~/modules/utils';

const log = getLogger('Users Query');
const articleTypes = db.collection('articleTypes');

export async function createArticleType({
  description,
  name,
  options = {},
  slug,
  status,
  title
}: ArticleTypeInput) {
  const articleType = await articleTypes.save(
    {
      createdAt: timeStamp(),
      description,
      name,
      options,
      status,
      slug: formatSlug({ title: slug }),
      title
    },
    {
      returnNew: true
    }
  );

  articleType.new.id = await articleType.new._key;

  return articleType.new;
}

export async function updateArticleType({
  id,
  description,
  name,
  options = {},
  slug,
  status,
  title
}: ArticleTypeInput) {
  const data = {
    description,
    name,
    options,
    slug: formatSlug({ title: slug }),
    status,
    title,
    updatedAt: timeStamp()
  };

  const articleType = await articleTypes.update(id, data, {
    returnNew: true
  });

  articleType.new.id = await articleType.new._key;

  return articleType.new;
}

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
