# NovaScript - Research and Survey Platform

NovaScript is a full-stack web application that allows researchers to publish research papers, create surveys, and analyze the results. It also enables users to participate in surveys and access research papers.

## Features

- **User Authentication**: Register and login system with JWT authentication
- **Research Paper Management**: Upload, view, and manage research papers
- **Survey System**: Create, respond to, and analyze surveys
- **Dashboard**: User-friendly interface for researchers and participants

## Technology Stack

- **Frontend**: React, Chart.js, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **File Storage**: GridFS for PDF storage
- **Authentication**: JWT with bcrypt

## Project Structure

The project follows a modular architecture:

```
server/
  ├── config/        # Database configuration
  ├── controllers/   # API route handlers
  ├── middlewares/   # Middleware functions
  ├── models/        # Database schemas
  ├── routes/        # API routes
  └── utils/         # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB database (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs both the backend server and frontend development server concurrently.\
Backend runs on [http://localhost:5000](http://localhost:5000) and frontend on [http://localhost:3000](http://localhost:3000).

### `npm run server`

Runs only the backend server on [http://localhost:5000](http://localhost:5000).

### `npm start`

Runs only the frontend development server on [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## API Testing

To test the API endpoints, run:

```bash
node testApi.js
```

This will perform a series of tests on the API endpoints, including:
- User registration and authentication
- Survey creation and retrieval
- Project listing

Make sure the server is running before executing the test script.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
