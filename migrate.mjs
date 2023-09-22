import { dirname, join } from "path";
import { arangrate } from "./arangodb/index.mjs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrate = arangrate({
  path: join(__dirname, "arangodb/migrations"),
  collection: "migrations",
});

migrate.parse(process.argv);
