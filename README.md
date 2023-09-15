# NIPs Backend

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Node Version](https://img.shields.io/badge/node-16.14.0-green)

Serverless backend for NIPs file management built with Node.js, AWS Lambda, and DynamoDB.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Documentation](#api-documentation)
  - [Organizations](#organizations)
  - [Users](#users)
  - [Folders](#folders)
  - [Requirements](#requirements)
  - [Files](#files)
- [Common Response Formats](#common-response-formats)

## Overview

This is the serverless backend for NIPs, a file management service. The service is built using AWS Lambda, DynamoDB, and is orchestrated through the Serverless framework. It's written in Node.js and uses the Dynamoose ORM for easier object modeling in DynamoDB.

## Getting Started

### Prerequisites

- Node.js 16.x
- Yarn package manager
- AWS CLI
- Serverless CLI

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/your-repo/nips-backend.git
    ```

2. Navigate to the project directory

    ```bash
    cd nips-backend
    ```

3. Install dependencies using Yarn

    ```bash
    yarn install
    ```

4. Set up your environment variables. Create a `.env` file at the root of the project and populate it as per `.env.example`.

5. Start the local development server

    ```bash
    yarn dev
    ```

## API Documentation

### General Information

- **Base URL**: `http://localhost:3000`

All endpoints, except the login (`/authenticate`), require an `Authorization` header with a Bearer token, which can be obtained by calling the login endpoint.

#### Common Headers

```plaintext
Authorization: Bearer <token>
```

### Organizations

#### Create a New Organization

- **URL**: `/organization`
- **Method**: `POST`
- **Headers**: `Authorization`
  
**Sample Request Body**
```json
{
  // Your fields here
}
```

**Sample Success Response**
```json
{
  "message": "Created!",
  "organization": {
    // Organization data here
  }
}
```

### Users

#### Register a New User

- **URL**: `/register`
- **Method**: `POST`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "email": "abdo@dropin.mx",
  "name": "Jorge",
  "lastName": "Abdo",
  "password": "123",
  "type": "client",
  "isEnterprise": false,
  "organization": "d3ec6374-2973-482c-b1ac-8094c719e026"
}
```

**Sample Success Response**
```json
{
  "message": "Created!",
  "user": {
    // User data here
  }
}
```

#### Authenticate User

- **URL**: `/authenticate`
- **Method**: `POST`

**Sample Request Body**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Folders

#### Get All Folders

- **URL**: `/folders`
- **Method**: `GET`
- **Headers**: `Authorization`

**Sample Success Response**
```json
{
  "message": "Success!",
  "folders": [
    // Folders data here
  ]
}
```

#### Create a New Folder

- **URL**: `/folders`
- **Method**: `POST`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "folder": {
    "name": "DropIN_2020",
    "organization": "d4aa4467-b948-4408-a5e1-55562e56b844"
  },
  "requirements": [
    {
      "requirement": "Foto ine",
      "status": "created",
      "file": "file1"
    },
    {
      "requirement": "Pdf ficha técnica",
      "status": "created",
      "file": "file2"
    }
  ]
}
```

#### Edit a Folder

- **URL**: `/folders/{organization}/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "folder": "folderId123",
  "requirement": "First Requirement",
  "status": "Complete",
  "file": "newFileId",
  "organization": "org1"
}
```

### Requirements

#### Get All Requirements

- **URL**: `/requirements`
- **Method**: `GET`
- **Headers**: `Authorization`

**Sample Success Response**
```json
{
  "message": "Success!",
  "requirements": [
    // Requirements data here
  ]
}
```

#### Create a New Requirement

- **URL**: `/requirements`
- **Method**: `POST`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "requirement": "Foto ine",
  "status": "created",
  "file": "file1",
  "organization": "org1"
}
```

**Sample Success Response**
```json
{
  "message": "Created!",
  "requirement": {
    // Requirement data here
  }
}
```

#### Edit a Requirement

- **URL**: `/requirements/{organization}/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "requirement": "Foto ine",
  "status": "Complete",
  "file": "newFileId",
  "organization": "org1"
}
```

### Files

#### Get All Files

- **URL**: `/files`
- **Method**: `GET`
- **Headers**: `Authorization`

**Sample Success Response**
```json
{
  "message": "Success!",
  "files": [
    // Files data here
  ]
}
```

#### Create a New File

- **URL**: `/files`
- **Method**: `POST`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "file": "fileData",
  "organization": "org1"
}
```

**Sample Success Response**
```json
{
  "message": "Created!",
  "file": {
    // File data here
  }
}
```

#### Edit a File

- **URL**: `/files/{organization}/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization`

**Sample Request Body**
```json
{
  "file": "newFileData",
  "organization": "org1"
}
```


## Common Response Formats

Responses follow a consistent format, as shown below:

- `403 Forbidden`: Action not allowed
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Generic server error
- `400 Bad Request`: A required field is missing or incorrect
- `200 OK`: Success
- `201 Created`: Successfully created resource
- `202 Accepted`: Request accepted
