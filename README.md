# Typescript JWT auth template

### Setting up the project locally

#### 1. Client

`$ cd client`
`$ npm ci`
`$ npm start`

#### 2. Server

`$ cd server`
`$ npm ci`
`$ cp .env.example .env`

- Fill out the necessary in variables inside the server/.env file

- Create a new local Postgres database for this project

- Fill in the database connection data inside **config/config.json** file

To run the server:

`$ npm run dev`
