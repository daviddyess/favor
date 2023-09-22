import { Database, aql as template } from "arangojs";
import { CollectionType } from "arangojs/collection.js";
import { getLogger } from "logade";

/**
 * Logade
 * @param string text
 */
export function log(text) {
  getLogger("arangrate").info(text);
}

const DB = {
  url: process.env.ARANGO_URL,
  databaseName: process.env.ARANGO_DB,
  auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PW },
  devData: process.env.DEV_DATA || false,
};

export const db = new Database(DB);

export const aql = template;

/**
 * createCollection
 * @param {*} param
 * @returns
 */
export const createCollection = async ({
  name,
  options = {},
  silent = true,
}) => {
  const collection = await db.collection(name);

  try {
    await collection.create(options);
    if (!silent) {
      log.info(`Collection ${name} created!`);
    }
    return await collection.get();
  } catch (e) {
    if (!silent) {
      log.info(`Collection ${name} already exists!`);
    }
    return await collection.get();
  }
};
/**
 * createEdgeCollection
 * @param {*} param
 * @returns
 */
export const createEdgeCollection = async ({ name, silent = true }) => {
  return await createCollection({
    name,
    options: { type: CollectionType.EDGE_COLLECTION },
    silent,
  });
};
/**
 * dropCollection
 * @param {*} param0
 * @returns
 */
export const dropCollection = async ({ name, silent = true }) => {
  const collection = await db.collection(name);

  try {
    await collection.drop();
    if (!silent) {
      log.info(`Collection ${name} dropped!`);
    }
    return true;
  } catch (e) {
    if (!silent) {
      log.info(`Collection ${name} doesn't exist!`);
    }
    return false;
  }
};

/**
 * Current Time Stamp
 * @returns Date String
 */
export const timeStamp = () => {
  const date = new Date(Date.now());

  return date.toISOString();
};
