import chalk from "chalk";
import fs from "fs";
import config from "../config/config.js";

async function useLogout() {
  try {
    const { authFile, configDir } = config.paths;

    if (!fs.existsSync(authFile)) {
      console.log(chalk.yellow("You are not logged in."));
      return;
    }

    fs.unlinkSync(authFile);

    const otherFiles = fs.readdirSync(configDir);
    if (otherFiles.length === 0) {
      fs.rmdirSync(configDir);
    }

    console.log(chalk.green("Successfully logged out!"));
  } catch (error) {
    console.error(chalk.red("An error occurred while logging out:"));
    console.error(chalk.red(error.message));
    throw error;
  }
}

export default useLogout;
