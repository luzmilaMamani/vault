import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  // Parse mysql://user:pass@host:port/db
  const m = url.match(/^mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*?)$/);
  if (!m)
    throw new Error(
      "DATABASE_URL must be in format mysql://user:pass@host:port/db",
    );
  const [, user, pass, host, port, db] = m;
  console.log("Connecting to MySQL server", host, port);
  const conn = await mysql.createConnection({
    host,
    port: Number(port),
    user,
    password: pass,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`,
  );
  console.log("Database ensured:", db);
  await conn.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
