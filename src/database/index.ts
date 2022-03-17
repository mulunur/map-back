import { Client } from 'pg';
import { Sequelize } from 'sequelize-typescript';
import UtilsENVConfig from '../utils/utils-env-config';
import Log from '../utils/utils-log';
import config from './config';

export const sequelizeInstance = new Sequelize(config);

export async function createDbIfNotExist() {
  const dbName = UtilsENVConfig.getEnvConfig().dbName;
  const client = new Client({
    user: UtilsENVConfig.getProcessEnv().DB_USERNAME,
    password: UtilsENVConfig.getProcessEnv().DB_PASSWORD,
    database: 'postgres',
    host: UtilsENVConfig.getEnvConfig().dbUrl,
    port: UtilsENVConfig.getProcessEnv().DB_PORT,
  })
  
  await client.connect();

  const allDB = await client.query('SELECT datname FROM pg_database');

  if ((allDB.rows.findIndex(el => el.datname === dbName.toLowerCase())) === -1) {
    Log.info('creating database');
    await client.query(`CREATE DATABASE ${dbName}`);
  }
  await client.end();
}

export async function initSequelize() {
  try {
    await sequelizeInstance.authenticate();
    // await sequelizeInstance.dropSchema('public', { });
    // await sequelizeInstance.createSchema('public', {  });
    await sequelizeInstance.sync();
    Log.info('Sequelize was initialized');
  } catch (error) {
    Log.error(error);
    process.exit();
  }
}

export async function dropDB() {
  try {
    await sequelizeInstance.dropSchema('public', {});
    await sequelizeInstance.createSchema('public', {});
    await sequelizeInstance.sync();
    Log.info('Sequelize was initialized');
  } catch (error) {
    Log.error(error);
  }
}
