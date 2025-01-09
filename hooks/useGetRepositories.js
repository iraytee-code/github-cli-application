import fs from "fs";
import config from "../config/config.js";
import chalk from "chalk";
import Table from "cli-table3";

async function useGetRepositories() {
  const isAuthenticated = () => {
    const { authFile } = config.paths;
    return fs.existsSync(authFile);
  };
  if (!isAuthenticated()) {
    console.log(chalk.red("Please login first using the <login> command."));
    return;
  }

  try {
    const octokit = config.auth.getOctokitInstance();
    const { data: repositories } =
      await octokit.rest.repos.listForAuthenticatedUser();

    const currentUser = config.auth.getCurrentUser();

    const table = new Table({
      head: [
        chalk.blue("Name"),
        chalk.blue("Language"),
        chalk.blue("Default Branch"),
        chalk.blue("Stars"),
        chalk.blue("Forks"),
        chalk.blue("Visibility"),
        chalk.blue("Created At"),
        chalk.blue("Updated At"),
      ],
      colWidths: [30, 15, 10, 10, 18, 12, 25, 25],
    });

    repositories.forEach((repository) => {
      table.push([
        chalk.green(repository.name),
        repository.language || "N/A",
        repository.default_branch,
        repository.stargazers_count,
        repository.forks_count,
        repository.private ? "private" : "public",
        new Date(repository.created_at).toLocaleDateString(),
        new Date(repository.updated_at).toLocaleDateString(),
      ]);
    });
    console.log(chalk.blue(`Hello ${currentUser} Your Repositories:`));
    console.log(table.toString());
    console.log(chalk.grey(`\nTotal repositories: ${repos.length}`));
  } catch (error) {}
}

export default useGetRepositories;
