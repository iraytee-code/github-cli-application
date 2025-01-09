# GitHub CLI Application
my solution for the [github-user-activity](https://roadmap.sh/projects/github-user-activity) challenge from [roadmap.sh](https://roadmap.sh/).

A command-line interface application for interacting with GitHub, allowing users to perform common GitHub operations directly from their terminal.


## Features

The application provides the following core functionalities:
- GitHub account authentication
- Repository listing
- User search and profile viewing
- Session management

## Commands

### Login
Authenticates user with GitHub credentials.

```bash
github-cli login
```

This command:
1. Prompts for GitHub username
2. Requests a personal access token
3. Validate the provided credentials
4. Securely saves the credentials for future sessions

### Logout
Terminates the current GitHub session.

```bash
github-cli logout
```

This command removes stored credentials and ends the active session.

### List Repositories
Displays user's personal GitHub repositories.

```bash
github-cli repositories
```

This command fetches and displays a list of repositories owned by the authenticated user.

### Search Users
Search for GitHub users and view their profiles.

```bash
# Search for users
github-cli search-users -k <keyword>

# View specific user profile
github-cli search-users -v <username>
```

Options:
- `-k, --keyword <keyword>`: Search term for finding GitHub users
- `-v, --view <username>`: Username of the specific profile to view

## Technical Architecture

The application is built using Node.js and implements several custom hooks for functionality:

- `useLogin.js`: Handles user authentication
- `useValidateCredentials.js`: Verifies provided GitHub credentials
- `useGetRepositories.js`: Fetches user repositories
- `useGetUsersProfile.js`: Retrieves user profiles
- `useLogout.js`: Manages session termination
- `useSaveCredentials.js`: Handles secure credential storage

The application uses the Commander.js library for CLI argument parsing and command structure. It also uses the Octokit GitHub SDK to aid user authentication.

## Version Information

- Current Version: 1.0.0
- Node.js Environment: Uses ES Modules

## Error Handling

The application implements try-catch blocks for error handling, particularly in the login process to manage authentication failures gracefully.

## Security Considerations

- Credentials are validated before being saved
- Personal access tokens are required for authentication
- Secure credential storage implementation
- Session management for security

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

