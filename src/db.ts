import { createClient } from '@libsql/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const libsql = createClient({
  url: `${process.env.TURSO_DATABASE_URL}`,
  // url: `libsql://estiasisaas-aris.turso.io`,
  authToken: `${process.env.TURSO_AUTH_TOKEN}`,
});

const adapter = new PrismaLibSQL(libsql);
export const db = new PrismaClient({ adapter });

// // db.ts
// import { PrismaClient } from '@prisma/client';
// import { PrismaLibSQL } from '@prisma/adapter-libsql';
// import { createClient } from '@libsql/client';
// import md5 from 'md5';

// const prismaClientCache: { [businessKey: string]: PrismaClient } = {};

// /**
//  * Generate a unique database name from the business name.
//  */
// export function getDatabaseName(businessName: string): string {
//   return md5(businessName);
// }

// /**
//  * Build the database URL based on the hashed business name and your Turso organization.
//  * For example: <hashedBusinessName>-<TURSO_ORG>.turso.io
//  */
// function getDatabaseUrl(dbName: string): string {
//   return `${dbName}-${process.env.TURSO_ORG}.turso.io`;
// }

// /**
//  * Get the libsql URL used by PrismaLibSQL adapter.
//  * For example: libsql://<hashedBusinessName>-<TURSO_ORG>.turso.io
//  */
// function getLibsqlUrl(businessName: string): string {
//   const dbName = getDatabaseName(businessName);
//   const url = getDatabaseUrl(dbName);
//   return `libsql://${url}`;
// }

// /**
//  * Retrieve a PrismaClient instance for the given business.
//  * If it doesn’t exist, create one and cache it.
//  */
// export function getPrismaClientForBusiness(businessName: string): PrismaClient {
//   // Use the businessName (or its hash) as the key
//   const key = businessName;
//   if (prismaClientCache[key]) {
//     return prismaClientCache[key];
//   }

//   const libsqlClient = createClient({
//     url: getLibsqlUrl(businessName),
//     authToken: process.env.TURSO_GROUP_AUTH_TOKEN,
//   });
//   const adapter = new PrismaLibSQL(libsqlClient);
//   const client = new PrismaClient({ adapter });
//   prismaClientCache[key] = client;
//   return client;
// }

// // db.ts
// import { PrismaClient } from "@prisma/client";
// import { PrismaLibSQL } from "@prisma/adapter-libsql";
// import { createClient as createLibsqlClient } from "@libsql/client";
// import { createClient as createTursoClient } from "@tursodatabase/api";
// import md5 from "md5";
// import { redirect } from "next/navigation";

// // Create a Turso client for database management
// const turso = createTursoClient({
//   token: process.env.TURSO_API_TOKEN!,
//   org: process.env.TURSO_ORG!,
// });

// /**
//  * Returns a unique database name for the current user.
//  * Here we use md5(userId) to generate a stable name per user.
//  */
// export function getDatabaseName(businessName:string): string | null {

//   return businessName ? md5(businessName) : null;
// }

// /**
//  * Constructs the database URL using the database name and your Turso organization.
//  * For example: `<dbName>-<TURSO_ORG>.turso.io`
//  */
// function getDatabaseUrl(dbName: string | null): string | null {
//   return dbName ? `${dbName}-${process.env.TURSO_ORG}.turso.io` : null;
// }

// /**
//  * Returns the libsql URL for connecting to the tenant's database.
//  * For example: `libsql://<dbName>-<TURSO_ORG>.turso.io`
//  */
// function getLibsqlUrl(businessName:string): string | null {
//   const dbName = businessName ? md5(businessName) : null;
//   const url = getDatabaseUrl(dbName);
//   console.log({ url });
//   return url ? `libsql://${url}` : null;
// }

// /**
//  * Returns the dump URL of the tenant's database.
//  * For example: `https://<dbName>-<TURSO_ORG>.turso.io/dump`
//  */
// export function getDumpUrl(businessName:string): string | null {
//   const dbName = getDatabaseName(businessName);
//   const url = getDatabaseUrl(dbName);
//   return url ? `https://${url}/dump` : null;
// }

// /**
//  * Checks whether the tenant's database exists using the Turso API.
//  */
// export async function checkDatabaseExists(businessName:string): Promise<boolean> {
//   const dbName = getDatabaseName(businessName);
//   if (!dbName) return false;

//   try {
//     await turso.databases.get(dbName);
//     return true;
//   } catch (error) {
//     console.error("Error checking database existence:", error);
//     return false;
//   }
// }

// /**
//  * Returns a PrismaClient instance for the current tenant.
//  * It builds the connection URL dynamically and uses PrismaLibSQL as the adapter.
//  */
// export async function getDatabaseClient(businessName:string): Promise<PrismaClient | null> {
//   const url = getLibsqlUrl(businessName);

//   if (!url) {
//     console.error("Failed to create database client: URL is null.");
//     return redirect("/welcome");
//   }

//   try {
//     const libsqlClient = createLibsqlClient({
//       url,
//       authToken: process.env.TURSO_AUTH_TOKEN,
//     });
//     const adapter = new PrismaLibSQL(libsqlClient);
//     const db = new PrismaClient({ adapter });
//     return db;
//   } catch (error) {
//     console.error("Failed to create database client:", error);
//     return null;
//   }
// }
