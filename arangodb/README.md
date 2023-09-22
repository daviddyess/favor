# ArangoDB Migration Tool

## Usage

### Environment Variables

```env
ARANGO_URL="http://localhost:8529"
ARANGO_DB="myproject"
ARANGO_USER="user"
ARANGO_PW="password"
DEV_DATA=false
```

`DEV_DATA` allows you to switch between development and production migrations. `DEV_DATA=true` means you are using the development migrations.

### Migrations

Helper functions:

- db
  - Database instance
- aql
  - Template strings from `arangojs`
- createCollection
- createEdgeCollection
- dropCollection

Anything that can be done with the `Database` class from `arangojs` can be done with the `db` object here.

Usage of the helper functions is demonstrated in the examples below.

Migrations will be stored as determined in the `migrate.mjs` script, currently `arangodb/migrations`. Naming convention for migrations use the following format:

- [indentifier].do.[title].js

Reversions use `.undo.` instead of `.do.`, but should use the same identifier and title in the following format:

- [identifier].undo.[title].js

The `identifier` should provide an alphabetical or numerical order, such as `0001`, `0002`, `0003`...

The `title` is displayed in the console log and stored in the migrations collection for reference later.

Each migration must have a default export: `export default async fuction setup() { ... }` to handle the migration. You write the queries or use the helpers to perform the migration.

#### Example - 0001.do.initial.js

```js
import { db, createCollection, createEdgeCollection } from "../utils.mjs";
import { getLogger } from "logade";

export default async function setup() {
  const log = getLogger("0001");

  log.info("Migrating");

  const documentCollections = [
    "notifications",
    "profiles",
    "sessions",
    "users",
  ];
  const edgeCollections = ["hasPrivilege", "hasRole"];

  for (const localName of documentCollections) {
    await createCollection({ name: localName });
  }

  for (const localName of edgeCollections) {
    await createEdgeCollection({ name: localName });
  }

  /**
   * Sessions Indexes
   */
  const sessions = await db.collection("sessions");

  await sessions.ensureIndex({
    type: "hash",
    unique: false,
    fields: ["uid"],
  });

  await sessions.ensureIndex({
    type: "hash",
    unique: false,
    fields: ["expires"],
  });

  /**
   * Users Indexes
   */
  const users = await db.collection("users");

  await users.ensureIndex({
    type: "hash",
    unique: true,
    fields: ["username"],
  });

  await users.ensureIndex({
    type: "hash",
    unique: true,
    fields: ["email"],
  });

  /**
   * Notifications
   */
  const notifications = await db.collection("notifications");

  await notifications.ensureIndex({
    type: "hash",
    unique: false,
    fields: ["userId"],
  });

  return true;
}
```

#### Migrate

```ssh
npm run migrate
```

```ssh
2021-10-03 16:56:09 [info][migrate] Performing target DEVELOPMENT migration!
2021-10-03 16:56:09 [info][arangrate] Total migrations: 1
2021-10-03 16:56:09 [info][0001] Migrating
2021-10-03 16:56:09 [info][arangrate] Migration 0001 - 0001.initial complete!
2021-10-03 16:56:09 [info][migrate] Migration target for DEVELOPMENT completed!
```

#### Example - 0001.undo.initial.js

```js
import { dropCollection } from "../utils.mjs";
import { getLogger } from "logade";

export default async function setup() {
  const log = getLogger("0001");

  log.info("Reverting");

  const documentCollections = [
    "notifications",
    "profiles",
    "sessions",
    "users",
  ];
  const edgeCollections = ["hasPrivilege", "hasRole"];

  for (const localName of documentCollections) {
    await dropCollection({ name: localName });
  }

  for (const localName of edgeCollections) {
    await dropCollection({ name: localName });
  }

  return true;
}
```

#### Revert a Migration

To revert, simply provide the migration identifier you would to revert to. If you are on migration `6`, you can revert to any identifier before `6`, such as entering `5` to revert just migration `6`, with `0` being to revert all.

```ssh
npm run migrate 0
```

```ssh
2021-10-03 16:59:52 [info][migrate] Performing target DEVELOPMENT migration!
2021-10-03 16:59:52 [info][arangrate] Total migrations: 1
2021-10-03 16:59:52 [info][0001] Reverting
2021-10-03 16:59:52 [info][arangrate] Reverted 0001 - 0001.initial complete!
2021-10-03 16:59:52 [info][migrate] Migration target for DEVELOPMENT completed!
```
