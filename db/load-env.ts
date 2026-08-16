// Must be the FIRST import in any standalone script (db/migrate.ts,
// db/seed.ts) that also imports ./index — ES module imports are evaluated
// in source order, each to completion, before sibling imports run. Since
// db/index.ts reads process.env.DATABASE_URL at module-evaluation time
// (not lazily inside a function), dotenv's config() has to finish running
// — as this module's own top-level side effect — before db/index.ts is
// ever imported, or it'll capture an unset/placeholder connection string.
import { config } from "dotenv";

config({ path: ".env.local" });
