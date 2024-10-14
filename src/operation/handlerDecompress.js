import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'stream';
import zlib from 'node:zlib';
import { stat } from 'node:fs/promises';
import { getCurrentPath } from '../utils/currentPath.js';
import { parseOperation3Args, isAccessPath } from '../utils/path.js';

export const handlerDecompress = async(operation) => {
    try {
        const arrParamOperation = parseOperation3Args(operation.trim());
        if (arrParamOperation.length != 3) {
            console.log('Invalid input');
            return;
        }
        let pathFile = arrParamOperation[1].trim();
        
        if (pathFile[1].indexOf(':') === -1) {
            pathFile = path.join(getCurrentPath(), pathFile);
        }
        let pathNewFile = arrParamOperation[2].trim();

        if (pathNewFile.indexOf(':') === -1) {
            pathNewFile = path.join(getCurrentPath(), pathNewFile);
        } else {
            pathNewFile = path.join(pathNewFile);
        }
        if (await isAccessPath(pathFile)) {
            await stat(pathNewFile).then(() => {
                console.log(pathNewFile);
                console.log('Operation failed: file exists');
            }).catch(async () => {
                const readStream = fs.createReadStream(pathFile);
                const writeStream = fs.createWriteStream(pathNewFile);
                const zlibDecompress = zlib.BrotliDecompress();
                pipeline(readStream, zlibDecompress, writeStream, (err) => {
                    if (err) console.log('Operation failed');
                });
            });
        } else {
            console.log('Operation failed');
        }
    } catch {
        console.log('Operation failed');
    }
}
