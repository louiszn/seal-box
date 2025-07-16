import { drizzle } from "drizzle-orm/node-postgres";

import config from "../config.js";

const db = drizzle(config.databaseURL);

export function testConnection() {
	return db.execute("SELECT 1 + 1 AS result");
}

export default db;
