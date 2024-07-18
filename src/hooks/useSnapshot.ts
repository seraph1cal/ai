// 在 session 中存入的数组,用于快速存取的方法
/* 
{
    bg,draw,main,mask,color
}

*/
// export default (name: string) => {
//   const pushDrawData = data => {
//     const _drawData = sessionStorage.getItem(name);
//     if (!_drawData) {
//       sessionStorage.setItem(name, JSON.stringify([data]));
//     } else {
//       const existingData = JSON.parse(_drawData);
//       sessionStorage.setItem(name, JSON.stringify([...existingData, data]));
//     }
//   };

//   const getDrawData = () => {
//     const _drawData = sessionStorage.getItem(name);
//     return _drawData ? JSON.parse(_drawData) : [];
//   };

//   const popDrawData = () => {
//     const drawData = getDrawData();
//     if (drawData.length === 0) {
//       return null; // 栈为空，返回 null
//     }
//     const poppedData = drawData.pop(); // 出栈操作
//     sessionStorage.setItem(name, JSON.stringify(drawData)); // 更新栈数据
//     return poppedData;
//   };

//   const getLastDrawData = () => {
//     const drawData = getDrawData();
//     return drawData.length ? drawData[drawData.length - 1] : {};
//   };

//   const getLength = () => {
//     return getDrawData().length;
//   };

//   const clearDrawData = () => {
//     sessionStorage.removeItem(name); // 清空栈数据
//   };

//   const clearDrawDataExceptLast = () => {
//     const drawData = getDrawData();
//     if (drawData.length > 1) {
//       const lastItem = drawData.pop();
//       sessionStorage.setItem(name, JSON.stringify([lastItem])); // 保留最后一项
//     }
//   };
//   return {
//     pushDrawData,
//     getDrawData,
//     popDrawData,
//     getLastDrawData,
//     getLength,
//     clearDrawData,
//     clearDrawDataExceptLast
//   };
// };

/* 使用 indexdb 重写 */
import { openDB } from 'idb';

export default name => {
  const dbPromise = openDB(name, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, { autoIncrement: true });
      }
    }
  });

  const pushDrawData = async data => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readwrite');
    const store = tx.objectStore(name);

    await store.add(data);
    await tx.done;
  };

  const getDrawData = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readonly');
    const store = tx.objectStore(name);
    const allData = await store.getAll();
    await tx.done;
    return allData;
  };

  const popDrawData = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readwrite');
    const store = tx.objectStore(name);
    const allKeys = await store.getAllKeys();
    if (allKeys.length === 0) {
      return null; // 栈为空，返回 null
    }
    const lastKey = allKeys[allKeys.length - 1];
    const poppedData = await store.get(lastKey);
    await store.delete(lastKey);
    await tx.done;
    return poppedData;
  };

  const getLastDrawData = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readonly');
    const store = tx.objectStore(name);
    const allKeys = await store.getAllKeys();
    if (allKeys.length === 0) {
      return {};
    }
    const lastKey = allKeys[allKeys.length - 1];
    const lastData = await store.get(lastKey);
    await tx.done;

    return lastData;
  };

  const getLength = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readonly');
    const store = tx.objectStore(name);
    const count = await store.count();
    await tx.done;
    return count;
  };

  const clearDrawData = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readwrite');
    const store = tx.objectStore(name);
    await store.clear();
    await tx.done;
  };

  const clearDrawDataExceptLast = async () => {
    const db = await dbPromise;
    const tx = db.transaction(name, 'readwrite');
    const store = tx.objectStore(name);
    const allKeys = await store.getAllKeys();
    if (allKeys.length > 1) {
      const lastKey = allKeys[allKeys.length - 1];
      for (const key of allKeys) {
        if (key !== lastKey) {
          await store.delete(key);
        }
      }
    }
    await tx.done;
  };

  return {
    pushDrawData,
    getDrawData,
    popDrawData,
    getLastDrawData,
    getLength,
    clearDrawData,
    clearDrawDataExceptLast
  };
};
