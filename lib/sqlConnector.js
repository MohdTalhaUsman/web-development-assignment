import sql from "mysql2/promise";

let databaseConnection;

export async function getDatabaseConnection() {
  if (!databaseConnection) {
    try {
      databaseConnection = await sql.createConnection({
        host: process.env.DATABASE_HOST,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      });
    } catch (error) {
      throw error;
    }
  }
  return databaseConnection;
}
