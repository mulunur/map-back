import {
  ApiMethodTypes,
  IRouteParams,
  SWComponentProp,
  SWInEnum,
  SWMethod,
  SWMethodParam,
  SWMethodResponse,
  SWRequiredProps,
} from './swagger-classes';
import SwaggerDoc from './swagger-doc';

//Добавление пути
export function addSWPath(
  ctrlPath: string,
  methodPath: string,
  methodType: ApiMethodTypes,
  routeParams?: IRouteParams
) {
  const newPath = getSWPathName(ctrlPath + methodPath);
  const tagName = getTagName(ctrlPath);

  const method: SWMethod = {
    summary: routeParams?.summary,
    description: routeParams?.description,
    tags: [tagName],
    responses: {} as { [code: string]: SWMethodResponse },
  };

  let parameters: SWMethodParam[] = [];

  //Добавляем path переменные - это всегда будет СТРОКА
  (ctrlPath + methodPath).split('/').forEach((el) => {
    if (el.startsWith(':')) {
      parameters.push(parseMethodParam(SWInEnum.PATH, el.replace(':', ''), el.replace(':', '')));
    }
  });

  //Добавляем заголовки
  if (routeParams?.headers) {
    Object.keys(routeParams.headers).forEach((key) => {
      parameters.push(parseMethodParam(SWInEnum.HEADER, key, routeParams.headers![key]));
    });
  }

  //Добавляем query
  if (routeParams?.query) {
    Object.keys(routeParams.query).forEach((key) => {
      parameters.push(parseMethodParam(SWInEnum.QUERY, key, routeParams.query![key]));
    });
  }

  method.parameters = parameters;

  //Добавляем BODY запроса
  if (routeParams?.body) {
    method.requestBody = {
      content: {
        'application/json': {
          schema: parseKeyToSWProp(routeParams.body),
        },
      },
    };
  }

  //API responses
  if (routeParams?.responses) {
    routeParams.responses.forEach((el) => {
      let methodResponse: SWMethodResponse = {
        description: el.description,
      };

      if (el.body) {
        methodResponse.content = {
          'application/json': {
            schema: parseKeyToSWProp(el.body),
          },
        };
      }

      method.responses[el.code.toString()] = methodResponse;
    });
  }

  SwaggerDoc.addTag(tagName);
  SwaggerDoc.addPath(newPath, methodType, method);
}

function parseMethodParam(swIn: SWInEnum, key: string, value: string | boolean | number): SWMethodParam {
  let newKey = key.replace('?', '');

  let type = 'string';
  if (typeof value === 'string') {
    type = 'string';
  } else if (typeof value === 'boolean') {
    type = 'boolean';
  } else if (typeof value === 'number') {
    if (Number.isInteger(value)) {
      type = 'integer';
    } else {
      type = 'number';
    }
  }

  return {
    in: swIn,
    name: newKey,
    required: !key.endsWith('?'),
    schema: {
      type: type,
      example: value,
    },
  };
}

function parseKeysToProps(obj: any): SWRequiredProps {
  let properties: { [propName: string]: SWComponentProp } = {};
  let required: string[] = [];
  Object.keys(obj).forEach((key) => {
    let newKey = key.replace('?', '');
    properties[newKey] = parseKeyToSWProp(obj[key]);
    if (!key.endsWith('?')) {
      required.push(newKey);
    }
  });

  return { required, properties };
}

function parseKeyToSWProp(propValue: any): SWComponentProp {
  let example: any | undefined = undefined;
  let type = 'string';
  let properties: { [propName: string]: SWComponentProp } | undefined = undefined;
  let items: SWComponentProp | undefined = undefined;
  let required: string[] | undefined = undefined;

  if (propValue === null) {
    type = 'object';
    example = propValue;
  } else if (typeof propValue === 'string') {
    type = 'string';
    example = propValue;
  } else if (typeof propValue === 'boolean') {
    type = 'boolean';
    example = propValue;
  } else if (typeof propValue === 'number') {
    if (Number.isInteger(propValue)) {
      type = 'integer';
    } else {
      type = 'number';
    }
    example = propValue;
  } else if (typeof propValue === 'object') {
    if (Array.isArray(propValue)) {
      //Это массив значений(100% - должен быть НУЛЕВОЙ элемент)
      type = 'array';
      items = parseKeyToSWProp(propValue[0]);
    } else {
      //Это объект
      type = 'object';
      let tmpObject = parseKeysToProps(propValue);
      properties = tmpObject.properties;
      required = tmpObject.required;
    }
  }

  return {
    type,
    example,
    required,
    properties,
    items,
  };
}

function getTagName(path: string) {
  return path
    .split('/')
    .map((el) => {
      if (el.startsWith(':')) {
        return `${el.replace(':', '')}`;
      }
      return el;
    })
    .map((el) => el.charAt(0).toUpperCase() + el.substring(1))
    .join('');
}

function getSWPathName(path: string) {
  return path
    .split('/')
    .map((el) => {
      if (el.startsWith(':')) {
        return `${el.replace(':', '{')}}`;
      }
      return el;
    })
    .join('/');
}
