import fs from "fs";
import { aql, db, createCollection, log, timeStamp } from "./utils.mjs";

export class Arangrate {
  migrations = false;
  constructor(options) {
    this.options = options;
    this.up = [];
    this.down = [];
    this.max = 0;
  }

  async migrate(target) {
    const { path } = this.options;

    await createCollection({ name: this.options.collection });

    const collection = await db.collection(this.options.collection);

    let info;

    // eslint-disable-next-line no-sync
    const files = fs.readdirSync(path);

    for (const file of files) {
      info = file.split(".");
      // Forward migration targets
      if (info[1] === "do") {
        this.up.push({
          step: info[0],
          file,
          migration: `${info[0]}.${info[2]}`,
        });
        ++this.max;
        this.migrations = true;
      }
      // Revertable migration targets
      if (info[1] === "undo") {
        this.down.push({
          step: info[0],
          file,
          migration: `${info[0]}.${info[2]}`,
        });
      }
    }

    const storedMigrations = await db.query(aql`
      FOR m IN ${collection}
        SORT m.code ASC
        RETURN { code: m.code, file: m.file, migration: m.migration }
    `);
    const result = await storedMigrations.all();

    log(`Total migrations: ${this.max}`);

    // Perform migrations
    if (target === "max" || target > this.max) {
      if (result.length > 0 && result.length === this.max) {
        log("No migration needed!");
        return;
      }

      const last = {
        code:
          result[result.length - 1] !== undefined
            ? result[result.length - 1].code
            : 0,
      };

      let func;

      let setup;
      const date = timeStamp();

      for (const mig of this.up) {
        if (Number(mig.step) > Number(last.code)) {
          func = await import(`${path}/${mig.file}`);
          setup = func.default;
          await setup();
          await db.query(aql`
            INSERT {
              code: ${mig.step},
              migration: ${mig.migration},
              file: ${mig.file},
              date: ${date}
            } IN ${collection}
          `);
          log(`Migration ${mig.step} - ${mig.migration} complete!`);
        }
      }
      if (target > this.max) {
        log(
          `Migration ${target} not available. Max migration (${this.max}) reached!`
        );
      }
    } else {
      this.down.reverse();
      let func;

      let setup;
      // Check if this is a forward or revert, run up or down

      if (Number(target) < this.max) {
        if (Number(target) === 0) {
          for (const mig of this.down) {
            for (const previous of result) {
              if (mig.step === previous.code) {
                func = await import(`${path}/${mig.file}`);
                setup = func.default;
                const m = await setup();

                if (m === true) {
                  await db.query(aql`
                FOR m in ${collection}
                  FILTER m.code == ${previous.code}
                  REMOVE m IN ${collection}
              `);
                }

                log(`Reverted ${mig.step} - ${mig.migration} complete!`);
              }
            }
          }
        } else {
          for (const mig of this.down) {
            for (const previous of result) {
              if (mig.step === previous.code && mig.step > Number(target)) {
                func = await import(`${path}/${mig.file}`);
                setup = func.default;
                const m = await setup();

                if (m === true) {
                  await db.query(aql`
                FOR m in ${collection}
                  FILTER m.code == ${previous.code}
                  REMOVE m IN ${collection}
              `);
                }

                log(`Reverted ${mig.step} - ${mig.migration} complete!`);
              }
            }
          }
        }
      }
    }
  }
}
