import { AxiosRequestConfig, AxiosResponse } from 'axios';
import Log from '../utils/utils-log';

export function logAxiosErrorInterceptor(error: any) {
  Log.error(error);
  return Promise.reject(error);
}

export function logRequestInterceptor(config: AxiosRequestConfig) {
  const defaultHeaders = ['common', 'delete', 'get', 'head', 'post', 'put', 'patch'];
  const method = config.method?.toUpperCase();
  const headers: Record<string, any> = {};

  let logData = '\n' + Log.makeDate() + ' | ' + '---> ' + method + ' | ' + config.url;

  for (const key in config.headers) {
    if (!defaultHeaders.includes(key)) {
      headers[key] = config.headers[key];
    }
  }

  logData += '\n' + 'HEADERS: ' + JSON.stringify(headers, null, 2);

  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    logData += '\n' + 'BODY: ' + JSON.stringify(config.data, null, 2);
  }
  logData += '\n' + '---> END ' + method;
  Log.default(logData);

  return config;
}

export function logResponseInterceptor(response: AxiosResponse<any>) {
  const method = response.config.method?.toUpperCase();

  let logData = '\n' + Log.makeDate() + ' | ' + '<--- ' + response.status + ' ' + method + ' | ' + response.config.url;
  logData += '\n' + 'HEADERS: ' + JSON.stringify(response.headers, null, 2);

  if (method === 'POST' || method === 'PATCH' || method === 'PUT') {
    logData += '\n' + 'BODY: ' + JSON.stringify(response.data, null, 2);
  }
  logData += '\n' + '<--- END HTTP';
  Log.default(logData);

  return response;
}
