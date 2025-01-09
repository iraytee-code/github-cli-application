#!/usr/bin/env node

import { program } from "commander";
import useLogin from "./hooks/useLogin.js";
import useValidateCredentials from "./hooks/useValidateCredentials.js";
import useGetRepositories from "./hooks/useGetRepositories.js";
import useGetUsersProfile from "./hooks/useGetUsersProfile.js";
import useLogout from "./hooks/useLogout.js";
import { useSaveCredentials } from "./hooks/useSaveCredentials.js";
import chalk from "chalk";
import boxen from "boxen";

const welcomeConfig = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
};

const availableCommands = [
  {
    command: "repositories",
    description: "List your personal github repositories",
    example: "github-cli repositories",
  },
  {
    command: "search-users",
    description: "Search for users repositories",
    example: "github-cli search-users --keyword <keyword>",
  },
  {
    command: "search-users",
    description: "View information about a specific user",
    example: "github-cli search-users --username <username>",
  },
  {
    command: "logout",
    description: "Sign out from your account",
    example: "github-cli logout",
  },
];

function displayWelcomeMessage(username) {
  const message = chalk.bold.green(`Welcome, ${username}! 🎉`);
  console.log(boxen(message, welcomeConfig));
}

function displayAvailableCommands() {
  console.log(chalk.blue.bold("\nAvailable Commands:"));
  console.log(chalk.dim("Here are the things you can do:\n"));

  availableCommands.forEach(({ command, description, example }) => {
    console.log(chalk.yellow(`• ${command}`));
    console.log(chalk.dim(`  ${description}`));
    console.log(chalk.dim(`  Example: ${example}\n`));
  });

  console.log(chalk.blue.bold("\nNeed Help?"));
  console.log(
    chalk.dim("Run any command with --help to see detailed usage information")
  );
  console.log(chalk.dim("Example: github-cli repo create --help\n"));
}

program
  .version("1.0.0")
  .description("An application for accessing github from the command line.");

program
  .command("login")
  .description("Log in to your github account.")
  .action(async () => {
    try {
      const { username, token } = await useLogin();
      await useValidateCredentials(username, token);
      await useSaveCredentials(username, token);
      displayWelcomeMessage(username);
      displayAvailableCommands();
    } catch (error) {
      console.error(chalk.red("Login failed:"), error.message);
      process.exit(1);
    }
  });

program
  .command("logout")
  .description("Log out of your github account")
  .action(async () => {
    await useLogout();
  });

program
  .command("repositories")
  .description("List your personal repositories")
  .action(async () => {
    await useGetRepositories();
  });

program
  .command("search-users")
  .description("Search for GitHub users and view their profiles")
  .option("-k, --keyword <keyword>", "Search keyword for GitHub users")
  .option("-v, --view <username>, View detailed user profile")
  .action(async ({ keyword, view }) => {
    await useGetUsersProfile(keyword, view);
  });

program.parse(process.argv);
