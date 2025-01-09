import fs from "fs";
import config from "../config/config.js";
import Table from "cli-table3";
import chalk from "chalk";

async function useGetUsersProfile(keyword, view) {
  const isAuthenticated = () => {
    const { authFile } = config.paths;
    return fs.existsSync(authFile);
  };

  if (!isAuthenticated()) {
    console.log(chalk.red("Please login first using the <login> command."));
    return;
  }

  const octokit = config.auth.getOctokitInstance();

  try {
    if (view) {
      const { data: user } = await octokit.users.getByUsername({
        username: view,
      });

      const currentUser = config.auth.getCurrentUser();

      console.log(
        `${chalk.blue(currentUser)} you are viewing ${chalk.green(
          user.login
        )}'s profile:`
      );

      const table = new Table({
        head: [
          chalk.blue("Name"),
          chalk.blue("Bio"),
          chalk.blue("email"),
          chalk.blue("Location"),
          chalk.blue("Public Repos"),
          chalk.blue("Followers"),
          chalk.blue("Following"),
          chalk.blue("Joined"),
        ],
        colWidths: [15, 25, 25, 20, 15, 13, 13, 13],
      });

      table.push([
        chalk.green(user.login),
        user.bio || "N/A",
        user.email || "N/A",
        user.location || "N/A",
        user.public_repos,
        user.followers,
        user.following,
        new Date(user.created_at).toLocaleDateString(),
      ]);

      console.log(table.toString());
      console.log(user);
    } else if (keyword) {
      const { data: searchResults } = await octokit.search.users({
        q: keyword,
      });

      if (searchResults.items.length === 0) {
        console.log(chalk.yellow("\nNo users found matching the keyword."));
        return;
      }

      console.log(chalk.blue(`Users matching "${keyword}":`));

      // Fetch complete user data for each search result
      const detailedUsers = await Promise.all(
        searchResults.items.map(async (user) => {
          try {
            const { data: fullUserData } = await octokit.users.getByUsername({
              username: user.login,
            });
            return fullUserData;
          } catch (error) {
            console.error(
              `Error fetching data for user ${user.login}:`,
              error.message
            );
            return {
              ...user,
              bio: "N/A",
              email: "N/A",
              location: "N/A",
              public_repos: "N/A",
              followers: "N/A",
              following: "N/A",
              created_at: new Date().toISOString(),
            };
          }
        })
      );

      const table = new Table({
        head: [
          chalk.blue("Name"),
          chalk.blue("Bio"),
          chalk.blue("email"),
          chalk.blue("Location"),
          chalk.blue("Public Repos"),
          chalk.blue("Followers"),
          chalk.blue("Following"),
          chalk.blue("Joined"),
        ],
        colWidths: [15, 40, 25, 20, 15, 13, 13, 13],
      });

      detailedUsers.forEach((user) => {
        table.push([
          chalk.green(user.login),
          user.bio || "N/A",
          user.email || "N/A",
          user.location || "N/A",
          user.public_repos || "N/A",
          user.followers || "N/A",
          user.following || "N/A",
          new Date(user.created_at).toLocaleDateString(),
        ]);
      });

      console.log(table.toString());
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

export default useGetUsersProfile;
