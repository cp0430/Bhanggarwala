# Bhanggarwala

## Overview

Bhanggarwala is a Node.js application that utilizes several libraries to create a robust server-side functionality. This project demonstrates the use of Express for server creation, MongoDB for database operations, GridFS for file storage, and various other libraries for image processing, authentication, and data validation.

## Features

- **Express**: For creating the server and handling HTTP requests.
- **Body-Parser**: To parse incoming request bodies.
- **Multer**: For handling multipart/form-data, used for file uploads.
- **MongoDB**: For database operations.
- **GridFSBucket**: For storing and retrieving large files within MongoDB.
- **Bcrypt**: For hashing passwords.
- **Canvas**: For server-side image manipulation.
- **JSON Web Token (JWT)**: For authentication.
- **Zod**: For data validation.

## Prerequisites

Make sure you have the following installed on your local machine:

- Node.js (version 14 or higher)
- npm (Node package manager)

## Installation

1. Clone the repository:
   ```bash
   [git clone https://github.com/your-username/Bhanggarwala.git](https://github.com/cp0430/Bhanggarwala.git)
   ```

2. Navigate to the project directory:
   ```bash
   cd Bhanggarwala
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory of the project and add your MongoDB URI and other configuration details:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

2. Make sure your MongoDB server is running and accessible with the provided URI.

## Running the Application

To start the application, run:

```bash
npm start
```

The server will start on the port specified in your configuration (default is 3000).

## Usage

The application provides various endpoints for:

- User authentication (signup, login)
- File uploads and downloads using GridFS
- Image processing
- Data validation

Refer to the source code and comments within the code for detailed information on each endpoint and its usage.

## Dependencies

The project uses the following libraries:

- `express`
- `body-parser`
- `multer`
- `mongodb`
- `bcrypt`
- `canvas`
- `jsonwebtoken`
- `zod`

Ensure all dependencies are installed by running `npm install` before attempting to run the application.

Demo Mobile Application prototype: <a href = "http://bit.ly/Bhanggarwala">Click Here!!</a>

## Contributing

Feel free to fork this repository and contribute by submitting a pull request. Please ensure your code follows the existing code style and includes appropriate tests.


Thank you for using Bhanggarwala! If you encounter any issues, please open an issue on the GitHub repository.
