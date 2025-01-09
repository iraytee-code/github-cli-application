import { Octokit } from "@octokit/rest";

async function useValidateCredentials(username, token) {
  try {
    const octokit = new Octokit({
      auth: token,
    });
    const { data: userData } = await octokit.users.getAuthenticated();
    if (userData.login.toLowerCase() !== username.toLowerCase()) {
      throw new Error("username does not match the authenticated account");
    }

    return { octokit, userData };
  } catch (error) {
    throw new Error(
      "Invalid credentials. Please check your username and token."
    );
  }
}

export default useValidateCredentials;
