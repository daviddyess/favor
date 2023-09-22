import "dotenv/config";
export {
  aql,
  db,
  createCollection,
  createEdgeCollection,
  dropCollection,
} from "./utils.mjs";
export { migrate as arangrate } from "./migrate.mjs";
