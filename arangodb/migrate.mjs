import program from "commander";
import { getLogger } from "logade";
import { Arangrate } from "./arangrate.mjs";
const log = getLogger("migrate");

export const migrate = ({ path, collection }) => {
  const arangrate = new Arangrate({
    path,
    collection: collection || "migrations",
  });

  return program
    .version("0.1")
    .arguments("[target]")
    .action(async (target) => {
      try {
        log.info(
          `Performing target ${
            process.env.DEV_DATA ? "DEVELOPMENT" : "PRODUCTION"
          } migration!`
        );
        await arangrate.migrate(target ? target : "max");
        log.info(
          `Migration target for ${
            process.env.DEV_DATA ? "DEVELOPMENT" : "PRODUCTION"
          } completed!`
        );
      } catch (error) {
        const {
          stack,
          code = "unknown",
          detail,
          position,
          schema,
          table,
          column,
        } = error;

        let message = `Code ${code} `;

        if (schema && table) {
          message += `on ${schema}.${table} `;

          if (column) {
            message += `.${column}`;
          }
        } else {
          message += `at offset ${position} `;
        }

        if (detail) {
          message += `- ${detail}`;
        }

        log.error(`Message: ${message}`);
        log.error(`Error: ${stack}`);
      }
    });
};
