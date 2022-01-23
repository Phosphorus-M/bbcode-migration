const convert = require('./../bbcode-to-markdown/src/bbcode-to-markdown');
require('dotenv').config();

const { DB_USER, DB_PASS, DB_PORT, DB_NAME, ACCESS_KEY, DB_HOST } = process.env;
const knex = require('knex').knex({
  client: 'mysql',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  }
});


const start = async (table, id, content) => {
  const transaction = await knex.transaction();
  try {
    const values = await knex(table).select(id, content);
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const message = convert(value[content]);
      console.log(message);
      await transaction(table).where(id, value[id]).update(content, message);
    }
    await transaction.commit();
  }
  catch (err) {
    await transaction.rollback();
    console.log(err);
  }
}

// start("FUdThreads", 't_id', 'message');
start("FUdUsers", 'u_id', 'signature');
start("FUdComments", 'c_id', 'message');