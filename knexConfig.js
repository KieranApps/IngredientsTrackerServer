import knex from 'knex'
import knexfile from './knexfile.js'

const myknex = knex(knexfile);

export default myknex