import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Ensure DATABASE_URL is loaded
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

async function runMigrate() {
  console.log("Running migrations...");
  
  // Create a connection to the database
  const sql = postgres(process.env.DATABASE_URL as string, { max: 1 });
  
  // Create Drizzle DB instance
  const db = drizzle(sql);

  try {
    await migrate(db, { migrationsFolder: './migrations' });
    console.log("Migrations completed successfully");
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    await sql.end();
    process.exit(1);
  }
}

runMigrate();