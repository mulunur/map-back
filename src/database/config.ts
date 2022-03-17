import { SequelizeOptions } from 'sequelize-typescript';
import UtilsENVConfig from '../utils/utils-env-config';

export = {
  host: UtilsENVConfig.getEnvConfig().dbUrl,
  port: UtilsENVConfig.getProcessEnv().DB_PORT,
  database: UtilsENVConfig.getEnvConfig().dbName,
  dialect: 'postgres',
  username: UtilsENVConfig.getProcessEnv().DB_USERNAME,
  password: UtilsENVConfig.getProcessEnv().DB_PASSWORD,
  models: [__dirname + '/models/final/*.model.*', __dirname + '/models/relations/*.model.*'],
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
} as SequelizeOptions;
