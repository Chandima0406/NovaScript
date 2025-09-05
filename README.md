# NovaScript - Research and Survey Platform

NovaScript is a full-stack web application that allows researchers to publish research papers, create surveys, and analyze the results. It also enables users to participate in surveys and access research papers.

## Overview

NovaScript offers a comprehensive platform for academic researchers to manage their research projects, collect survey data, analyze budget allocations, and collaborate with peers. The application provides an intuitive interface for both researchers and participants.

## Features

- **User Authentication**: Secure register and login system with JWT authentication
- **Research Paper Management**: Upload, view, and manage research papers
- **Survey System**: Create, respond to, and analyze surveys
- **Dashboard**: User-friendly interface for researchers and participants
- **Budget Tracking**: Manage and track research project budgets
- **AI Assistant**: Get AI-powered help for research projects
- **Task Management**: Create and track research tasks and milestones
- **Notifications**: Real-time notification system for updates and changes

## Technology Stack

- **Frontend**: React, Chart.js, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **File Storage**: GridFS for PDF storage
- **Authentication**: JWT with bcrypt

## Project Structure

The project follows a modular architecture:

```
NovaScript/
  ├── public/        # Static assets
  ├── src/           # React frontend
  │   ├── api.js           # API communication
  │   ├── assets/          # Images and assets
  │   ├── components/      # Reusable components
  │   ├── pages/           # Page components
  │   └── styles/          # CSS files
  └── server/        # Node.js backend
      ├── config/         # Database configuration
      ├── controllers/    # API route handlers
      ├── middlewares/    # Middleware functions
      ├── models/         # Database schemas      ├── routes/         # API routes
      ├── services/       # Business logic
      └── utils/          # Utility functions
      
## Installation and Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd NovaScript
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create `.env` file in the root directory and in the server directory with the following variables:
   ```
   # Root .env
   REACT_APP_API_URL=http://localhost:5000/api

   # Server .env
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret-key>
   NODE_ENV=development
   ```

4. Run development server
   ```
   npm run dev
   ```

## Production Deployment

To create a production build:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

### Deployment Options

NovaScript supports multiple deployment options:

1. **Traditional Deployment**:
   ```
   npm run deploy
   ```
   
2. **Docker Deployment**:
   ```
   docker build -t novascript .
   docker run -p 5000:5000 novascript
   ```
   
3. **Cloud Services**: Deploy to Heroku, AWS, Azure, or other cloud providers

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).
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

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

For more information about deployment and advanced configuration, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Support

For support, please contact us at support@novascript.com or create an issue in this repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
