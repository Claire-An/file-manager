import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'stream';
import zlib from 'node:zlib';
import { stat, writeFile } from 'node:fs/promises';
import { getCurrentPath } from '../utils/currentPath.js';
import { parseOperation3Args, isAccessPath } from '../utils/path.js';
import { getNameFile } from '../utils/fileOperation.js';

export const handlerCompress = async(operation) => {
    try {
        const arrParamOperation = parseOperation3Args(operation.trim());
        if (arrParamOperation.length != 3) {
            console.log('Invalid input');
            return;
        }
        let pathFile = arrParamOperation[1].trim();
        const nameFile = getNameFile(pathFile);
        if (pathFile[1].indexOf(':') === -1) {
            pathFile = path.join(getCurrentPath(), pathFile);
        }
        let pathNewFile = arrParamOperation[2].trim();
        if (pathNewFile.length === 1 || pathNewFile[1].indexOf(':') === -1) {
            pathNewFile = path.join(getCurrentPath(), pathNewFile, nameFile + '.br');
        } else {
            pathNewFile = path.join(pathNewFile, nameFile + '.br');
        }
        if (await isAccessPath(pathFile)) {
            await stat(pathNewFile).then(() => {
                console.log('Operation failed: file exists');
            }).catch(async () => {
                await writeFile(pathNewFile, '', (err) => {
                    if (err) console.log('Operation failed');
                });
                const readStream = fs.createReadStream(pathFile, 'utf8');
                const writeStream = fs.createWriteStream(pathNewFile, 'utf8');
                const zlibCompress = zlib.createBrotliCompress();
                pipeline(readStream, zlibCompress, writeStream, (err) => {
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
