import { dropCollection } from '../utils.mjs';
import { getLogger } from 'logade';

export default async function setup() {
  const log = getLogger('0001');

  log.info('Reverting');

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
    await dropCollection({ name: localName });
  }

  for (const localName of edgeCollections) {
    await dropCollection({ name: localName });
  }

  return true;
}
