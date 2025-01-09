import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = dirname(__dirname);

// Load environment variables from .env file
dotenv.config({ path: join(rootDir, ".env") });

// Validate required environment variables
const requiredEnvVars = ["ENCRYPTION_KEY", "AUTH_TAG_LENGTH", "IV_LENGTH"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
}

export const env = {
  encryption: {
    key: process.env.ENCRYPTION_KEY,
    authTagLength: parseInt(process.env.AUTH_TAG_LENGTH),
    ivLength: parseInt(process.env.IV_LENGTH),
  },
};
