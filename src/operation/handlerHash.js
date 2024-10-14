import path from 'path';
import { readFile } from 'node:fs/promises';
import crypto from 'crypto';
import { getCurrentPath } from '../utils/currentPath.js';
import { parseOperation } from '../utils/path.js';

export const handlerHash = async (operation) => {
    const arrParamOperation = parseOperation(operation.trim());
    if (arrParamOperation.length != 2) {
        console.log('Invalid input');
        return;
    }

    const pathFile = path.join(getCurrentPath(), arrParamOperation[1]);

    try {
        const contents = await readFile(pathFile, { encoding: 'utf8' }).catch(() => {
            console.log('Operation failed');
            return;
        });
        const hash = crypto.createHash('sha256').update(contents).digest('hex');
        console.log(hash);
    } catch {
        console.log('Operation failed');
    }
}
