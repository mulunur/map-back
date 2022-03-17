import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { throwError } from '../utils/http-exception';
import Log from '../utils/utils-log';
import { logRequestInterceptor, logAxiosErrorInterceptor, logResponseInterceptor } from './net-client-logger';

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => logRequestInterceptor(config),
  (error) => logAxiosErrorInterceptor(error)
);

axios.interceptors.response.use(
  (response: AxiosResponse<any>) => logResponseInterceptor(response),
  (error) => logAxiosErrorInterceptor(error)
);

//Класс обертка над axios
export default class NetClient {
  private headers: any = {};
  private targetHost: string = '';
  private targetUrl: string = '';
  private params: any = {};

  constructor() {}

  url(url: string) {
    this.targetUrl = url;
    return this;
  }

  host(host: string) {
    this.targetHost = host;
    return this;
  }

  addHeader(name: string, value: string) {
    this.headers[name] = value;
    return this;
  }

  addHeaders(headers: any) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }

  addParams(params: any) {
    this.params = {
      ...this.params,
      ...params,
    };
    return this;
  }

  static create() {
    return new NetClient();
  }

  async get(params?: any) {
    return await axios
      .get(`${this.targetHost}${this.targetUrl}`, {
        params,
        headers: this.headers,
      })
      .catch(this.catchAxiosError);
  }

  async post(data?: any) {
    return await axios
      .post(`${this.targetHost}${this.targetUrl}`, data, {
        params: this.params,
        headers: this.headers,
      })
      .catch(this.catchAxiosError);
  }

  async put(data?: any) {
    return await axios
      .put(`${this.targetHost}${this.targetUrl}`, data, {
        params: this.params,
        headers: this.headers,
      })
      .catch(this.catchAxiosError);
  }

  async patch(data?: any) {
    return await axios
      .patch(`${this.targetHost}${this.targetUrl}`, data, {
        params: this.params,
        headers: this.headers,
      })
      .catch(this.catchAxiosError);
  }

  async delete(params?: any) {
    return await axios
      .delete(`${this.targetHost}${this.targetUrl}`, {
        params,
        headers: this.headers,
      })
      .catch(this.catchAxiosError);
  }

  private catchAxiosError(error: any): never {
    Log.error('NETWORK', error.message);
    let errObj = {
      statusCode: 500,
      message: error.message,
    };
    if (error.response) {
      errObj.statusCode = error.response.status;
      if (error.response.data) {
        errObj.message = error.response.data.message;
      }
    }
    throwError(errObj);
  }
}
