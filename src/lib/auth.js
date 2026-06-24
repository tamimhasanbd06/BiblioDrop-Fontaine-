// বাংলা মন্তব্য: Better Auth configuration একই MongoDB database ব্যবহার করছে।
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "biblioteca";

if (!mongoUri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

if (!process.env.BETTER_AUTH_URL) {
  throw new Error("Missing BETTER_AUTH_URL in .env.local");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("Missing BETTER_AUTH_SECRET in .env.local");
}


const client = new MongoClient(mongoUri);
const db = client.db(dbName);

export const auth = betterAuth({
  appName: "BiblioDrop",

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
          },
        }
      : {}),
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
        returned: true,
      },
    },
  },

  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ].filter(Boolean),
});