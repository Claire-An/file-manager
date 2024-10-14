import path from 'path';
import { isAccessPath } from './path.js';

export const getPathFile = async (currentPath, newPath) => {
    if (newPath[1] == ':') {
        if (await isAccessPath(newPath)) {
            return newPath;
        }     
    }

    const joinPath = path.join(currentPath, newPath);
 
    if (await isAccessPath(joinPath)){
        return joinPath;
    } else {
        console.log('Operation failed');
    }
}

export const getPathNewFile = (pathFile, fileName) => {
    const pos = pathFile.lastIndexOf('\\') ===-1 ? pathFile.lastIndexOf('/') : pathFile.lastIndexOf('\\');
    if (pos !== -1) return path.join(pathFile.slice(0, pos), fileName);
    else return fileName;
}

export const getNameFile = (pathFile) => {
    const pos = pathFile.lastIndexOf('\\') ===-1 ? pathFile.lastIndexOf('/') : pathFile.lastIndexOf('\\');
    if (pos !== -1) return pathFile.slice(pos+1);
    else return pathFile;
}
