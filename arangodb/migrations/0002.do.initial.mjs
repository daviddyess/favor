import { db, createCollection, createEdgeCollection } from '../utils.mjs';
import { getLogger } from 'logade';

export default async function setup() {
  const log = getLogger('0002');

  log.info('Migrating');

  const documentCollections = ['comments'];

  for (const localName of documentCollections) {
    await createCollection({ name: localName });
  }

  /**
   * comments
   */
  const comments = await db.collection('comments');

  await comments.ensureIndex({
    type: 'persistent',
    name: 'articleTypeId',
    unique: false,
    fields: ['articleTypeId']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'articleId',
    unique: false,
    fields: ['articleId']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'createdAt',
    unique: false,
    fields: ['createdAt']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'parentId',
    unique: false,
    fields: ['parentId']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'path',
    unique: false,
    fields: ['path']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'status',
    unique: false,
    fields: ['status']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'updatedAt',
    unique: false,
    fields: ['updatedAt']
  });
  await comments.ensureIndex({
    type: 'persistent',
    name: 'userId',
    unique: false,
    fields: ['userId']
  });

  return true;
}
