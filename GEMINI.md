# Project Overview

This is a simple web application named "DogBreeds" built with Node.js, Express, Sequelize (ORM), and SQLite. It serves a frontend application that displays a collection of dog breeds fetched from a SQLite database. The application is designed to be straightforward, showcasing basic CRUD operations (though only read is implemented via API) and static file serving.

## Key Technologies:
*   **Backend:** Node.js, Express.js
*   **Database:** SQLite
*   **ORM:** Sequelize
*   **Frontend:** HTML, CSS, Vanilla JavaScript
*   **Styling:** Custom CSS with a dark theme.
*   **Testing:** Jest (though no tests were reviewed)

## Architecture:
*   `server.js`: The main entry point for the backend. It sets up the Express server, handles static file serving from the `public` directory, and defines the API endpoint `/api/breeds`.
*   `models/`: Contains Sequelize model definitions (`dog.js`) and database connection/initialization logic (`index.js`).
*   `data/`: Stores the `dogbreeds.sqlite` database file.
*   `public/`: Contains all frontend assets including `index.html`, `app.js`, `styles.css`, and images.
*   `scripts/`: Contains utility scripts, specifically `seed.js` for populating the database.
*   `tests/`: Contains unit and integration tests for the application.

## Functionality:
*   **Frontend:** A single-page application that fetches dog breed data from the backend and displays it in a responsive grid. Each dog breed is presented as a card with an image, title, origin, year, and description.
*   **Backend:** Provides a REST API endpoint (`/api/breeds`) to retrieve all dog breed information from the database. It connects to the SQLite database using Sequelize and synchronizes the models upon startup.

# Building and Running

The project is a Node.js application.

## Prerequisites:
*   Node.js (LTS version recommended)
*   npm (Node Package Manager) or Yarn

## Installation:
1.  Clone the repository (if applicable).
2.  Navigate to the project root directory.
3.  Install dependencies:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

## Database Seeding:
To populate the SQLite database with initial dog breed data:
```bash
npm run seed
```
This script will create the `dogbreeds.sqlite` file in the `data/` directory and insert some sample data.

## Running the Application:

### Development Mode (with `nodemon` for auto-restarts):
```bash
npm run dev
```
The server will typically run on `http://localhost:3001`.

### Production Mode:
```bash
npm start
```
The server will typically run on `http://localhost:3001`.

## Testing:
The project uses `jest` for testing. To run tests:
```bash
npm test
```
*A unit test for the `Dog` model has been added in `tests/dog.test.js`.*

# Development Conventions

## Code Style:
*   The codebase appears to follow a relatively consistent style, though no explicit linter or formatter configuration was found.
*   Comments are primarily in Russian.

## Database Interaction:
*   Sequelize ORM is used for all database interactions, promoting a structured approach to data management.
*   Database models are defined in the `models/` directory.

## Frontend Structure:
*   The frontend is a vanilla JavaScript application, using DOM manipulation to render content.
*   CSS styling is handled in `public/styles.css`, utilizing CSS variables for theme management.

## Project Structure:
*   Clear separation of concerns with dedicated directories for models, scripts, public assets, and data.

## API Endpoints:
*   The primary API endpoint is `/api/breeds` for fetching dog breed data. Additional endpoints for CUD operations would follow RESTful principles if implemented.