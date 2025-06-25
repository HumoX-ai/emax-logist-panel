# Emaxb Frontend

This repository contains the frontend codebase for the Emaxb logistics project. It is built using modern web technologies and frameworks to provide a seamless user experience.

## Features

- **React**: Built with React for a dynamic and responsive UI.
- **Next.js**: Utilizes Next.js for server-side rendering and static site generation.
- **TypeScript**: Written in TypeScript for type safety and better developer experience.
- **State Management**: Includes state management for efficient data handling.
- **Authentication**: Supports OAuth and other authentication mechanisms.
- **Responsive Design**: Fully responsive and mobile-friendly.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or pnpm (v7 or higher)
- A modern web browser

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-organization/emaxb-frontend.git
   cd emaxb-frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

## Development

To start the development server, run:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Build

To build the project for production, run:

```bash
pnpm build
```

The output will be located in the `.next` directory.

## Testing

Run the test suite using:

```bash
pnpm test
```

## Environment Variables

The project requires the following environment variables to be set:

- `NEXTAUTH_URL`: The base URL for authentication.
- `NEXTAUTH_SECRET`: The secret key for authentication.
- `AUTH_URL`: The URL for the authentication provider.

Create a `.env.local` file in the root directory and add the required variables.

## Folder Structure

- **`/pages`**: Contains the Next.js pages.
- **`/components`**: Reusable React components.
- **`/styles`**: Global and component-specific styles.
- **`/utils`**: Utility functions and helpers.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please contact the development team at `support@emaxb.com`.
