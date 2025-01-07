require('dotenv').config();

module.exports = {

    client: process.env.DATABASE_CLIENT,
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD, 
      database: process.env.DATABASE_DATABASE,
      port: process.env.DATABASE_PORT,
      charset: 'utf8mb4'
    },
    migrations: {
      directory: 'migrations',
    },
    seeds: {
      directory: 'seeds',
    }

};