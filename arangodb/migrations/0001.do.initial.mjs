import { db, createCollection, createEdgeCollection } from '../utils.mjs';
import { getLogger } from 'logade';

export default async function setup() {
  const log = getLogger('0001');

  log.info('Migrating');

  const date = new Date(Date.now());

  const timeStamp = date.toISOString();

  const documentCollections = [
    'articles',
    'articleTypes',
    'blocks',
    'blockGroups',
    'blockTypes',
    'comments',
    'privileges',
    'roles',
    'users'
  ];
  const edgeCollections = ['hasAccess', 'hasBlock', 'hasPrivilege', 'hasRole'];

  for (const localName of documentCollections) {
    await createCollection({ name: localName });
  }

  for (const localName of edgeCollections) {
    await createEdgeCollection({ name: localName });
  }

  /**
   * articles types
   */
  const articleTypes = await db.collection('articleTypes');

  await articleTypes.ensureIndex({
    type: 'persistent',
    name: 'slug',
    unique: false,
    fields: ['slug']
  });
  await articleTypes.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: false,
    fields: ['name']
  });
  await articleTypes.ensureIndex({
    type: 'persistent',
    name: 'createdAt',
    unique: true,
    fields: ['createdAt']
  });
  await articleTypes.ensureIndex({
    type: 'persistent',
    name: 'status',
    unique: false,
    fields: ['status']
  });
  await articleTypes.ensureIndex({
    type: 'persistent',
    name: 'siteId',
    unique: false,
    fields: ['siteId']
  });

  /**
   * Import Article Types
   */
  await articleTypes.import([
    {
      createdAt: timeStamp,
      description: 'Blog',
      name: 'blog',
      options: {
        slugFormat: 'date-title',
        usePublishedDate: true,
        useSetDateAndTime: true,
        useStatus: true,
        useSummary: false,
        useSummaryAsIntro: false,
        useImage: false
      },
      status: 'enabled',
      slug: 'blog',
      title: 'Blog'
    }
  ]);

  /**
   * articles
   */
  const articles = await db.collection('articles');

  await articles.ensureIndex({
    type: 'persistent',
    name: 'articleTypeId',
    unique: false,
    fields: ['articleTypeId']
  });
  await articles.ensureIndex({
    type: 'persistent',
    name: 'createdAt',
    unique: false,
    fields: ['createdAt']
  });
  await articles.ensureIndex({
    type: 'persistent',
    name: 'articleTypeId_slug',
    unique: true,
    fields: ['articleTypeId', 'slug']
  });
  await articles.ensureIndex({
    type: 'persistent',
    name: 'status',
    unique: false,
    fields: ['status']
  });
  await articles.ensureIndex({
    type: 'persistent',
    name: 'updatedAt',
    unique: false,
    fields: ['updatedAt']
  });
  await articles.ensureIndex({
    type: 'persistent',
    name: 'userId',
    unique: false,
    fields: ['userId']
  });

  /**
   * Blocks
   */
  const blocks = await db.collection('blocks');

  await blocks.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: false,
    fields: ['name']
  });

  await blocks.ensureIndex({
    type: 'persistent',
    name: 'status',
    unique: false,
    fields: ['status']
  });

  /**
   * Block Groups
   */
  const blockGroups = await db.collection('blockGroups');

  await blockGroups.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: false,
    fields: ['name']
  });

  /**
   * Import Block Groups
   */
  await blockGroups.import([
    {
      description: 'Default Left Blocks Group',
      name: 'left',
      status: 'enabled',
      title: 'Left'
    }
  ]);

  /**
   * Block Types
   */
  const blockTypes = await db.collection('blockTypes');

  await blockTypes.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: false,
    fields: ['name']
  });

  /**
   * Import Block Types
   */
  await blockTypes.import([
    {
      name: 'html',
      title: 'HTML',
      description: 'Custom HTML content block',
      options: {}
    },
    {
      name: 'menu',
      title: 'Menu',
      description: 'Menu block',
      options: {}
    },
    {
      name: 'navbar',
      title: 'Navigation Bar',
      description: 'Horizontal Menu',
      options: {}
    },
    {
      name: 'rich-text',
      title: 'Rich Text',
      description: 'Content block using the Tiptap rich text editor',
      options: {}
    }
  ]);

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

  /**
   * Permissions Setup
   */
  const roles = await db.collection('roles');

  await roles.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: true,
    fields: ['name']
  });

  /** Privileges Indexes */

  const privileges = await db.collection('privileges');

  await privileges.ensureIndex({
    type: 'persistent',
    name: 'name',
    unique: true,
    fields: ['name']
  });

  /**
   * Users Indexes
   */
  const users = await db.collection('users');

  await users.ensureIndex({
    type: 'persistent',
    name: 'username',
    unique: true,
    fields: ['username']
  });

  await users.ensureIndex({
    type: 'persistent',
    name: 'email',
    unique: true,
    fields: ['email']
  });

  return true;
}
