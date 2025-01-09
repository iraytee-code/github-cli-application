import chalk from "chalk";
import inquirer from "inquirer";

async function useLogin() {
  console.log(chalk.blue("Please provide your GitHub credentials"));
  console.log(
    chalk.yellow(
      "Note: For security, please use a Personal Access Token instead of your password."
    )
  );
  console.log(
    chalk.yellow("You can generate one at: https://github.com/settings/tokens")
  );

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter your GitHub username or email:",
      validate: (input) =>
        input.length > 0 || "Email or username cannot be empty",
    },
    {
      type: "password",
      name: "token",
      message: "Personal Access Token:",
      mask: "*",
      validate: (input) => input.length > 0 || "Token cannot be empty",
    },
  ]);

  return answers;
}

export default useLogin;
