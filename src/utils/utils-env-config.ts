import { plainToClass } from 'class-transformer';
import { Constants, ENVTypes } from './constants';

interface ENVConfig {
  dbUrl: string;
  dbName: string;
  selfUrl: string;
  selfPort: number;
}

class ProcessENV {
  //Порты для запуска самого сервера
  public PORT_PROD: number = 3100;
  public PORT_DEV: number = 3000;

  //URL
  public URL_PROD: string = '';
  public URL_DEV: string = '';

  //Всё что касается основной БД
  public DB_URL_LOCAL: string = 'postgres';
  public DB_URL_STAND: string = 'postgres';
  public DB_USERNAME: string = 'postgres';
  public DB_PASSWORD: string = 'postgres';
  public DB_PORT: number = 5432;
  public TEST_DB_NAME: string = 'test_db';
  public DEV_DB_NAME: string = 'dev_db';
  public PROD_DB_NAME: string = 'prod_db';
}

export default class UtilsENVConfig {
  private static envConfig: ENVConfig;
  private static envType: ENVTypes;
  private static processENV: ProcessENV;

  static init() {
    this.envType = <ENVTypes>(<unknown>process.env.NODE_ENV!);
    this.processENV = plainToClass(ProcessENV, process.env);
    this.envConfig = this.initConfig();
  }

  private static initConfig() {
    switch (this.envType) {
      //Режим DEV - на ЛОКАЛЬНОЙ машине
      case ENVTypes.DEV: {
        return {
          dbUrl: this.processENV.DB_URL_LOCAL,
          dbName: this.processENV.DEV_DB_NAME,
          selfUrl: `${Constants.LOCAL_URL}:${this.processENV.PORT_DEV}`,
          selfPort: this.processENV.PORT_DEV,
        };
      }

      //Режим DEV - на глобальном сервере
      case ENVTypes.DEV_STAND: {
        return {
          dbUrl: this.processENV.DB_URL_STAND,
          dbName: this.processENV.DEV_DB_NAME,
          selfUrl: this.processENV.URL_DEV,
          selfPort: this.processENV.PORT_DEV,
        };
      }

      //Продакшн мод - на локальной машине
      case ENVTypes.PROD: {
        return {
          dbUrl: this.processENV.DB_URL_LOCAL,
          dbName: this.processENV.PROD_DB_NAME,
          selfUrl: `${Constants.LOCAL_URL}:${this.processENV.PORT_PROD}`,
          selfPort: this.processENV.PORT_PROD,
        };
      }

      //Продакшн мод - на ГЛОБАЛЬНОМ сервере
      case ENVTypes.PROD_STAND: {
        return {
          dbUrl: this.processENV.DB_URL_STAND,
          dbName: this.processENV.PROD_DB_NAME,
          selfUrl: this.processENV.URL_PROD,
          selfPort: this.processENV.PORT_PROD,
        };
      }

      //default = test
      default: {
        return {
          dbUrl: this.processENV.DB_URL_STAND,
          dbName: this.processENV.TEST_DB_NAME,
          selfUrl: this.processENV.URL_DEV,
          selfPort: this.processENV.PORT_DEV,
        };
      }
    }
  }

  static getEnvConfig(): ENVConfig {
    return this.envConfig;
  }

  static getProcessEnv(): ProcessENV {
    return this.processENV;
  }

  static isAvailable(...availableTypes: ENVTypes[]): boolean {
    return availableTypes.includes(this.envType);
  }
}
