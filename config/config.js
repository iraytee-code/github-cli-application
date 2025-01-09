import path from "path";
import os from "os";
import fs from "fs";
import { Octokit } from "@octokit/rest";
import { decryptToken } from "../hooks/useSaveCredentials.js";

const config = {
  // Application settings
  appName: "github-cli-tracker",

  // Path configurations
  get paths() {
    const configDir = path.join(os.homedir(), this.appName);

    return {
      configDir,
      authFile: path.join(configDir, "auth.json"),
      // Add more paths as needed
      logsDir: path.join(configDir, "logs"),
      cacheDir: path.join(configDir, "cache"),
    };
  },

  // Authentication utilities
  auth: {
    isAuthenticated() {
      return fs.existsSync(config.paths.authFile);
    },

    getAuthData() {
      if (!this.isAuthenticated()) {
        throw new Error("Not authenticated");
      }
      return JSON.parse(fs.readFileSync(config.paths.authFile, "utf8"));
    },

    getOctokitInstance() {
      const authData = this.getAuthData();
      const token = decryptToken(authData.token);
      return new Octokit({ auth: token });
    },

    getCurrentUser() {
      const authData = this.getAuthData();
      return authData.username;
    },
  },

  // Helper method for custom paths
  getCustomPath(...segments) {
    return path.join(os.homedir(), this.appName, ...segments);
  },

  // Ensure required directories exist
  ensureDirectories() {
    const { configDir, logsDir, cacheDir } = this.paths;

    [configDir, logsDir, cacheDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      }
    });
  },
};

export default config;
