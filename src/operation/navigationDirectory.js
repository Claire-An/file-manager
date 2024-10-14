import path from 'path';
import { readdir } from 'node:fs/promises';
import { setCurrentPath, getCurrentPath } from '../utils/currentPath.js';
import { parseOperation, isAccessPath } from '../utils/path.js';

export const handlerUp = (operation) => {
    if (operation.split(' ').length !== 1) {
        console.log('Invalid input');
        return;
    }
    setCurrentPath(path.dirname(getCurrentPath()));
}

export const handlerCd = async (operation) => {
    const arrParamOperation = parseOperation(operation.trim());
    if (arrParamOperation.length != 2) {
        console.log('Invalid input');
        return;
    }
    await getNewPath(getCurrentPath(), arrParamOperation[1]);
}

const getNewPath = async (currentPath, newPath) => {
    if (newPath[1] == ':') {
        if (await isAccessPath(newPath)) {
            setCurrentPath(newPath);
            return newPath;
        }     
    }
    const joinPath = path.join(currentPath, newPath);

    if (await isAccessPath(joinPath)){
        setCurrentPath(joinPath);
        return joinPath;
    } else {
        console.log('Operation failed');
    }
}

export const handlerLs = async (operation) => {
    if (operation.split(' ').length !== 1) {
        console.log('Invalid input');
        return;
    }
    await createTableList();
}

const createTableList = async() => {
    try {
        const files = await readdir(getCurrentPath(), {withFileTypes: true, encoding: 'utf8'});
        let arrObj = [];
        files.forEach((item) => {
            const type = item.isFile()?'file':item.isDirectory?'directory':'undefined';
            arrObj.push ({'name': item.name, 'type': type});
        });
        arrObj.sort((a, b) => {
            if (a.type > b.type) return 1;
            if (a.type < b.type) return -1;
            a.name > b.name? 1: -1;
        });
        console.table(arrObj);
        
    } catch (err) {
      console.error(err);
    }
}
