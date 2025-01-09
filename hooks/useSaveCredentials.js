import fs from "fs";
import chalk from "chalk";
import crypto from "crypto";
import config from "../config/config.js";
import { env } from "../config/env.js";

function deriveKey(password) {
  return crypto.createHash("sha256").update(String(password)).digest();
}

const ENCRYPTION_KEY = deriveKey(env.encryption.key); // This will create a 32-byte key

export function encryptToken(data) {
  const textToEncrypt = String(data);
  const iv = crypto.randomBytes(env.encryption.ivLength);

  const cipher = crypto.createCipheriv("aes-256-ccm", ENCRYPTION_KEY, iv, {
    authTagLength: env.encryption.authTagLength,
  });

  let encrypted = cipher.update(textToEncrypt, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, encrypted, authTag]).toString("hex");
}


export function decryptToken(encryptedData) {
  try {
    const data = Buffer.from(encryptedData, "hex");

    const iv = data.slice(0, env.encryption.ivLength);
    const encrypted = data.slice(
      env.encryption.ivLength,
      -env.encryption.authTagLength
    );
    const authTag = data.slice(-env.encryption.authTagLength);

    const decipher = crypto.createDecipheriv(
      "aes-256-ccm",
      ENCRYPTION_KEY,
      iv,
      { authTagLength: env.encryption.authTagLength }
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString("utf8");
  } catch (error) {
    throw new Error("Decryption failed: " + error.message);
  }
}

async function useSaveCredentials(username, token) {
  try {
    const { configDir, authFile } = config.paths;

    if (!fs.existsSync(configDir)) {
      console.log(chalk.yellow("Creating configuration directory..."));
      fs.mkdirSync(configDir, { mode: 0o700 });
    }

    const encryptedToken = encryptToken(token);
    const authData = {
      username,
      token: encryptedToken,
      lastLogin: new Date().toISOString(),
    };

    fs.writeFileSync(authFile, JSON.stringify(authData, null, 2), {
      mode: 0o600,
    });

    console.log(chalk.green("Credentials saved successfully!"));
  } catch (error) {
    console.error(chalk.red("An error occurred while saving credentials:"));
    console.error(chalk.red(error));
    throw error;
  }
}

export { useSaveCredentials };
