# Art Platform APIs

Node.js Express API server for the Art Platform

## Tech Stack

- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Migrations**: Sequelize CLI

## Setup

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=art_development
DB_NAME_TEST=art_test
DB_NAME_PROD=art_production
```

## Database Setup

1. Ensure PostgreSQL is running on your machine
2. Create the database:
   ```bash
   createdb art_development
   ```
3. Run migrations:
   ```bash
   npm run db:migrate
   ```

## Running the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on http://localhost:3000

## Database Commands

### Migrations

- Run all pending migrations:

  ```bash
  npm run db:migrate
  ```

- Undo the last migration:

  ```bash
  npm run db:migrate:undo
  ```

- Undo all migrations:

  ```bash
  npm run db:migrate:undo:all
  ```

- Create a new migration:
  ```bash
  npm run create:migration -- --name=migration-name
  ```

### Models

- Generate a new model with migration:

  ```bash
  npm run create:model -- --name=ModelName --attributes=field1:type,field2:type
  ```

  Example:

  ```bash
  npm run create:model -- --name=User --attributes=email:string,password:string,name:string
  ```

### Seeds

- Run all seeders:

  ```bash
  npm run db:seed:all
  ```

- Undo all seeders:
  ```bash
  npm run db:seed:undo
  ```

## API Endpoints

- `GET /api/health` - Health check endpoint

## Project Structure

```
apis/
├── config/
│   └── config.json          # Sequelize configuration
├── migrations/              # Database migrations
├── models/                  # Sequelize models
├── seeders/                 # Database seeders
├── .env                     # Environment variables
├── .sequelizerc             # Sequelize CLI configuration
├── index.js                 # Main application file
└── package.json
```
