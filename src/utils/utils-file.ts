import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';
import { Constants, FileTypes } from './constants';
import fs from 'fs';
import { glob } from 'glob';
import UtilsENVConfig from './utils-env-config';

interface FileData {
  id: string; //id - сгенеренный, в момент сохранения файда
  extension: string; //Расширение файла
  size: number; //Размер файла
  originalName: string; //Оригинальное название на компе, которое загрузили
  type: string; //Тип файла, берется из enum
}

//Метод для проверки и создания директорий
//Формат пути для директории - /asd/qwe/zxc
export function checkFolder(path: string) {
  fs.mkdirSync(process.cwd() + path, {
    recursive: true,
  });
}

//Сохраняем фотку в папку внутри сервера
export async function saveFile(file?: UploadedFile): Promise<FileData | undefined> {
  if (!file) return undefined;
  const fileData = processFile(file);
  const dirPath = process.cwd() + `${Constants.MEDIA_FOLDER}/${fileData.type.toLowerCase()}`;
  checkFolder(dirPath);

  await file.mv(`${dirPath}/${fileData.id}.${fileData.extension}`);

  return fileData;
}

//Удаление файла
export function deleteFile(fileName: string, params?: { folder?: string; extension?: string }) {
  let filePath = '';
  if (params?.folder) {
    filePath += '/' + params.folder + '/';
  } else {
    filePath += '/**/';
  }
  filePath += fileName;
  if (params?.extension) {
    filePath += '.' + params.extension;
  } else {
    filePath += '.*';
  }

  glob.sync(process.cwd() + `${Constants.MEDIA_FOLDER}${filePath}`).forEach((el) => {
    fs.unlinkSync(el);
  });
}

//Выбираем расширение и выьираем папку
export function processFile(file: UploadedFile): FileData {
  //Достаем расширение файла!
  let fileData: FileData = {
    id: uuidv4(),
    size: file.size,
    extension: file.name.substr(file.name.lastIndexOf('.') + 1),
    originalName: file.name.replace(file.name.substr(file.name.lastIndexOf('.') + 1), ''),
    type: getFileType(file.mimetype),
  };

  return fileData;
}

function getFileType(mimetype: string): FileTypes {
  //Это фотка/картинка
  if (mimetype.includes('image')) {
    return FileTypes.IMAGE;
  }

  //Это видео файл
  if (mimetype.includes('video')) {
    return FileTypes.VIDEO;
  }

  //Это аудионфайл
  if (mimetype.includes('audio')) {
    return FileTypes.AUDIO;
  }

  return FileTypes.DOCUMENT;

  //Это документ
  // if (file.mimetype.includes('application')) {
  //   fileData.fileFolder = 'files';
  // }
}

export function getFileVirtualUrl(fileType: string, fileId: string, fileExtension: string) {
  return (
    UtilsENVConfig.getEnvConfig().selfUrl +
    `${Constants.MEDIA_FOLDER}/${fileType.toLowerCase}/${fileId}.${fileExtension}`
  );
}
