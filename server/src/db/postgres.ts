const { Pool } = require("pg");
import dotenv from "dotenv";
dotenv.config();
export const pool = new Pool({
  user: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASSWORD,
  host: process.env.PG_DB_HOST,
  port: process.env.PG_DB_PORT,
  database: process.env.PG_DB_DATABASE || "URLvistas",
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 3000,
});

pool.on("error", (err: any) => {
  console.log("error ", err);
  process.exit(-1);
});