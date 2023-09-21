import { getLogger } from 'logade';
import { aql, db } from '../modules/arango';
import { timeStamp } from '../modules/utils';

const log = getLogger('Data Objects');
const dataObjects = db.collection('dataObjects');
const dynamicData = db.collection('dynamicData');

export async function createDataObject({
  description,
  name,
  fields = null,
  slug,
  slugFormat = 'id',
  source,
  status,
  title
}) {
  try {
    const dataObject = await dataObjects.save(
      {
        createdAt: timeStamp(),
        description,
        fields,
        name,
        slug,
        slugFormat,
        source,
        status,
        title
      },
      {
        returnNew: true
      }
    );

    dataObject.new.id = dataObject.new._key;

    return dataObject.new;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

export async function updateDataObject({
  id,
  description,
  fields = null,
  name,
  slug,
  slugFormat = 'id',
  source,
  status,
  title
}) {
  try {
    const data = {
      description,
      fields,
      name,
      slug,
      slugFormat,
      source,
      status,
      title,
      updatedAt: timeStamp()
    };

    const dataObject = await dataObjects.update(id, data, {
      returnNew: true
    });

    return dataObject.new;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

/**
 * Create Data Object Content [Mutation]
 */
export async function createDataObjectContent({ type, fields = null }) {
  try {
    const query = await db.query(aql`
      FOR dataObject IN ${dataObjects}
        FILTER dataObject._key == ${type}
        LIMIT 1
        RETURN dataObject
    `);

    const dataObjectType = await query.next();

    let doFields = {};

    if (Array.isArray(fields)) {
      fields?.map((field) => (doFields = { ...doFields, ...field }));
    }
    log.info(JSON.stringify(doFields, null, 2));
    const dataObject = await dynamicData.save(
      {
        type: dataObjectType._key,
        createdAt: timeStamp(),
        fields: { ...doFields }
      },
      {
        returnNew: true
      }
    );

    dataObject.new.id = dataObject.new._key;

    return dataObject.new;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

/**
 * Remove Data Object [Mutation]
 */
export async function removeDataObject(_, { id }) {
  await db.query(aql`
    FOR dataObject IN ${dataObjects}
      FILTER dataObject._key == ${id}
      REMOVE dataObject IN ${dataObjects}
  `);
  return await dataObjects.remove(id);
}
/**
 * Get Data Object by id or Slug [Query]
 */
export async function getDataObject({ id = null, slug = null }) {
  let dataObject;

  try {
    if (id !== null) {
      const query = await db.query(aql`
          FOR doc IN ${dataObjects}
            FILTER doc._key == ${id}
            LIMIT 1
            RETURN doc
        `);

      dataObject = await query.next();
    } else if (slug !== null) {
      const query = await db.query(aql`
          FOR doc IN ${dataObjects}
            FILTER doc.slug == ${slug}
            LIMIT 1
            RETURN doc
        `);

      dataObject = await query.next();
    } else {
      throw new Error('An Data Object id or slug is required!');
    }
    return dataObject;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

/**
 * Get Data Object Content by id or Slug [Query]
 */
export async function getDataObjectContent({ id = null, slug = null }) {
  let data;

  try {
    if (id !== null) {
      const query = await db.query(aql`
          FOR doc IN ${dynamicData}
            FILTER doc._key == ${id}
            LIMIT 1
            RETURN doc
        `);

      data = await query.next();
    } else if (slug !== null) {
      const query = await db.query(aql`
          FOR doc IN ${dynamicData}
            FILTER doc.slug == ${slug}
            LIMIT 1
            RETURN doc
        `);

      data = await query.next();
    } else {
      throw new Error('An Data Object id or slug is required!');
    }
    return data;
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}

/**
 * Get Data Objects [Query]
 */
export async function getDataObjects() {
  try {
    const dataObject = await db.query(
      aql`
      FOR dataObject IN ${dataObjects}
        SORT dataObject.name
        RETURN MERGE(dataObject, {"id": dataObject._key})
    `,
      { fullCount: true }
    );

    const totalCount = await dataObject?.extra?.stats?.fullCount;
    const nodes = await dataObject.all();

    return {
      count: nodes.length,
      totalCount,
      nodes
    };
  } catch (err: any) {
    log.error(err.message);
    log.error(err.stack);
    throw err;
  }
}
