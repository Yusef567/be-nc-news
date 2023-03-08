# NC News API

- This is an API for a news application which contains endpoints for news articles,topics,users and comments. Users can interact with the articles they view through posting and deleting comments, adding or decreasing votes and more.

- You can view the hosted version and interact with the API by visiting `https://backend-project-5gjj.onrender.com`.
- You can view all the valid endpoints by visiting `https://backend-project-5gjj.onrender.com/api`.

## Instructions getting started

## Setup

- This API was built using PostgreSQL(version 14.6) and Node.js(version 19.3.0).
- To check which versions of Node.js and PSQL you have use `node -v` and `psql -version` commands.
- To install PostgreSQL visit `https://www.postgresql.org/download/`.
- To install Node.js visit `https://nodejs.org/en/download/package-manager/`.

- Clone this repository using `git clone https://github.com/Yusef567/be-nc-news.git` command.

- Then use the `npm install` command to install all the dependencies on the package.json file.

## Creating the database

- You will need to create two `.env` files for your enviroment variables.
- First create a file called `.env.test` and, set the enviroment variable as `PGDATABASE=nc_news_test`
- Then create a file called `.env.devlopment`,inside the file set the development enviroment variable as `PGDATABASE=nc_news`
- Then to create the databases locally you can use the `npm run setup-dbs` script.

## Seeding

- Once you have created the database you can seed the development database with the `npm run seed` script, any changes made to the devlopment database will persist.

- The test database is reseeded before each test is ran and restarts every time you run the tests using the `npm test app.test.js` script with the seed data, changes to the test database do not presist.

## Testing

- Testing has been done using `jest` and `supertest`.
- Tests have been written following the TDD(Test Driven Development) process, to make sure the endpoints are working as intended.
- To run the tests use the `npm test app.test.js` script.

## Running the local server

- To start running the server locally use the `npm start` script, the server will be listening on port 9090.
- To stop running the server use ctrl + c.
