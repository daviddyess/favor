import { dropCollection } from '../utils.mjs';
import { getLogger } from 'logade';

export default async function setup() {
  const log = getLogger('0002');

  log.info('Reverting');

  const documentCollections = ['comments'];

  for (const localName of documentCollections) {
    await dropCollection({ name: localName });
  }

  return true;
}
