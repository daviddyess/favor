import { Database, aql as template } from 'arangojs';
import { db as DB } from './config';

export const db = new Database(DB);
export const aql = template;
export const findUnique = async ({ col, field, value }) => {
  const collection = db.collection(col);
  const query = await db.query(aql`
    FOR doc IN ${collection}
      FILTER doc.${field} == ${value}
      LIMIT 1
      RETURN doc
  `);
  const doc = await query.next();

  return doc;
};
export default {
  db,
  aql,
  findUnique
};
