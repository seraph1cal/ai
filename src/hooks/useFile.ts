/* 
调用接口,读取文件,

传入参数有 main blob file (通过上传获取/读取文件)
获得  main 和 mask

action : draw,bg,upload,color
*/
import { uploadImage } from '@/api/modules/ai';
import useSnapshot from './useSnapshot';
export enum Action {
  DRAW = 'draw',
  RESTORE = 'restore',
  BG = 'bg', //read
  UPLOAD = 'upload',
  COLOR = 'color'
}

export enum ReadType {
  MAIN = 'main',
  MASK = 'mask',
  BG = 'bg'
}

export default () => {
  let main = null,
    mask = null,
    color = null,
    draw = null,
    bg = null,
    restore = null;

  const { pushDrawData, getDrawData, getLastDrawData } = useSnapshot('drawStack');

  const readBlob2Base64 = (file, type: ReadType, fn?): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function () {
        const content = reader.result;
        if (type == ReadType['MAIN']) {
          main = content;
        } else if (type == ReadType['MASK']) {
          mask = content;
          await pushDrawData({ main, mask, color, draw, bg, restore });
          fn && fn();
        } else {
          await pushDrawData({ ...(await getLastDrawData()), restore, bg: content, color: null });
          fn && fn();
        }
        resolve();
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImageApi = async (file, fn) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'isnet-general-use');
    formData.append('a', 'true');
    formData.append('af', '240');
    formData.append('ab', '10');
    formData.append('ae', '10');
    formData.append('om', 'true');
    formData.append('ppm', 'true');
    const result = (await uploadImage(formData)) || {};
    readBlob2Base64(result, ReadType['MASK'], fn);
  };

  const handleAction = async (data: any, type: Action, fn?) => {
    if (type == Action['UPLOAD']) {
      await readBlob2Base64(data, ReadType['MAIN']);
      uploadImageApi(data, fn);
    } else if (type == Action['BG']) {
      readBlob2Base64(data, ReadType['BG'], fn);
    } else if (type == Action['COLOR']) {
      //bg ,color 只替换本身

      await pushDrawData({ ...(await getLastDrawData()), color: data, bg: null });
      fn && fn();
    } else if (type == Action['DRAW']) {
      //draw,保留全部,增加 draw
      const arr = (await getLastDrawData()).draw || [];
      arr.push(data);

      await pushDrawData({ ...(await getLastDrawData()), draw: arr });
      fn && fn();
    } else {
      const arr = (await getLastDrawData()).restore || [];
      arr.push(data);
      await pushDrawData({ ...(await getLastDrawData()), restore: arr });
      fn && fn();
    }
  };

  return {
    handleAction
  };
};
