import { db, createCollection, createEdgeCollection } from "../utils.mjs";
import { getLogger } from "logade";

export default async function setup() {
  const log = getLogger("0001");

  log.info("Migrating");

  const documentCollections = [
    "articles",
    "articleTypes",
    "privileges",
    "roles",
    "sessions",
    "users",
  ];
  const edgeCollections = ["hasAccess", "hasPrivilege", "hasRole"];

  for (const localName of documentCollections) {
    await createCollection({ name: localName });
  }

  for (const localName of edgeCollections) {
    await createEdgeCollection({ name: localName });
  }

  /**
   * articles
   */
  const articles = await db.collection("articles");

  await articles.ensureIndex({
    type: "persistent",
    name: "articleTypeId",
    unique: false,
    fields: ["articleTypeId"],
  });
  await articles.ensureIndex({
    type: "persistent",
    name: "createdAt",
    unique: false,
    fields: ["createdAt"],
  });
  await articles.ensureIndex({
    type: "persistent",
    name: "articleTypeId_slug",
    unique: true,
    fields: ["articleTypeId", "slug"],
  });
  await articles.ensureIndex({
    type: "persistent",
    name: "status",
    unique: false,
    fields: ["status"],
  });
  await articles.ensureIndex({
    type: "persistent",
    name: "updatedAt",
    unique: false,
    fields: ["updatedAt"],
  });
  await articles.ensureIndex({
    type: "persistent",
    name: "userId",
    unique: false,
    fields: ["userId"],
  });

  /**
   * articles types
   */
  const articleTypes = await db.collection("articleTypes");

  await articleTypes.ensureIndex({
    type: "persistent",
    name: "slug",
    unique: false,
    fields: ["slug"],
  });
  await articleTypes.ensureIndex({
    type: "persistent",
    name: "name",
    unique: false,
    fields: ["name"],
  });
  await articleTypes.ensureIndex({
    type: "persistent",
    name: "createdAt",
    unique: true,
    fields: ["createdAt"],
  });
  await articleTypes.ensureIndex({
    type: "persistent",
    name: "status",
    unique: false,
    fields: ["status"],
  });
  await articleTypes.ensureIndex({
    type: "persistent",
    name: "siteId",
    unique: false,
    fields: ["siteId"],
  });

  /**
   * Sessions Indexes
   */
  const sessions = await db.collection("sessions");

  await sessions.ensureIndex({
    type: "persistent",
    name: "uid",
    unique: false,
    fields: ["uid"],
  });

  await sessions.ensureIndex({
    type: "persistent",
    name: "expires",
    unique: false,
    fields: ["expires"],
  });

  /**
   * Permissions Setup
   */
  const roles = await db.collection("roles");

  await roles.ensureIndex({
    type: "persistent",
    name: "name",
    unique: true,
    fields: ["name"],
  });

  /** Privileges Indexes */

  const privileges = await db.collection("privileges");

  await privileges.ensureIndex({
    type: "persistent",
    name: "name",
    unique: true,
    fields: ["name"],
  });

  /**
   * Users Indexes
   */
  const users = await db.collection("users");

  await users.ensureIndex({
    type: "persistent",
    name: "username",
    unique: true,
    fields: ["username"],
  });

  await users.ensureIndex({
    type: "persistent",
    name: "email",
    unique: true,
    fields: ["email"],
  });

  return true;
}
