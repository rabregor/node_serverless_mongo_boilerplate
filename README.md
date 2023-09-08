# NIPS File Management Backend

## Overview

This project is a serverless backend application designed to manage files and user authentication for a client business. It's built using AWS services and the Serverless Framework.

## Technologies Used

- AWS Lambda
- AWS DynamoDB
- AWS S3
- Serverless Framework
- Node.js
- Bcrypt.js
- JSON Web Tokens (JWT)
- Dotenv

## Prerequisites

- Node.js and npm installed
- AWS CLI installed and configured
- Serverless Framework installed
- Yarn package manager

## Setup

### Install Dependencies

First, clone the repository and navigate into the project directory. Then install the dependencies:

```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root directory of your project and add your environment variables:

```env
SECRET_KEY=
```

### Deploy

To deploy the application to your AWS account:

```bash
serverless deploy
```

## Local Development

To run the functions locally for testing:

```bash
serverless invoke local --function functionName
```

Replace `functionName` with the name of the function you wish to test.

## Directory Structure

- `src/`: Source code
  - `config/`: Configuration files
    - `environment.js`: Environment variables
  - `handlers/`: AWS Lambda handlers
    - `authentication.js`: User authentication functions
    - `file.js`: File management functions
  - `utils/`: Utility modules
    - `dynamoHandler.js`: DynamoDB helper functions
    - `s3Handler.js`: S3 helper functions

## Important Functions

### Authentication

- `registerUser`: Registers a new user.
- `authenticateUser`: Authenticates an existing user.

### File Management

- `uploadFile`: Uploads a file to S3.
- `listFiles`: Lists all files for a user.
- `deleteFile`: Deletes a file from S3.
