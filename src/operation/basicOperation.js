import fs from 'node:fs';
import path from 'path';
import { pipeline } from 'stream';
import { stat, writeFile, rename, unlink } from 'node:fs/promises';
import { parseOperation, isAccessPath, parseOperation3Args } from '../utils/path.js';
import { getPathFile, getPathNewFile, getNameFile } from '../utils/fileOperarion.js';
import { getCurrentPath } from '../utils/currentPath.js';

export const handlerCat = async (operation) => {
    const arrParamOperation = parseOperation(operation.trim());
    if (arrParamOperation.length != 2) {
        console.log('Invalid input');
        return;
    }
    let pathFile;
    try {
        pathFile = await getPathFile(getCurrentPath(), arrParamOperation[1]);
        console.log(pathFile);
    } catch {
        console.log('File not found');
        return;
    };
    try {
        const stream = fs.createReadStream(pathFile, 'utf8');
        stream.pipe(process.stdout);
        return new Promise((resolve) => {
            stream.on('end', resolve);
        });
    } catch {
        console.log('Operation failed');
    };
}

export const handlerAdd = async(operation) => {
    const arrParamOperation = parseOperation(operation.trim());
    if (arrParamOperation.length != 2) {
        console.log('Invalid input');
        return;
    }
    const pathFile = path.join(getCurrentPath(), arrParamOperation[1]);
    try {
        await stat(pathFile).then(() => {
            console.log('Operation failed: file exists');
        }).catch(async () => {
            await writeFile(pathFile, '', (err) => {
                if (err) console.log('Operation failed');
            });
        });
    } catch {
        console.log('Operation failed');
    }
}

export const handlerRn = async(operation) => {
    const arrParamOperation = parseOperation3Args(operation.trim());
    if (arrParamOperation.length != 3) {
        console.log('Invalid input');
        return;
    }
    let pathFile = arrParamOperation[1].trim();
    if (pathFile[1].indexOf(':') === -1) {
        pathFile = path.join(getCurrentPath(), pathFile);
    }
    try {
        if (isAccessPath(pathFile)) {
            const pathNewFile = getPathNewFile(pathFile, arrParamOperation[2]);
            await stat(pathNewFile).then(() => {
                console.log('Operation failed');
            }).catch(async () => {
                await rename(pathFile, pathNewFile).catch(() => {
                    console.log('Operation failed');
                });
            });
        } else {
            console.log('Operation failed');
        }
    } catch {
        console.log('Operation failed');
    }
}

export const handlerCp = async(operation) => {
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
            pathNewFile = path.join(getCurrentPath(), pathNewFile, nameFile);
        } else {
            pathNewFile = path.join(pathNewFile, nameFile);
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
                pipeline(readStream, writeStream, (err) => {
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

export const handlerMv = async(operation) => {
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
            pathNewFile = path.join(getCurrentPath(), pathNewFile, nameFile);
        } else {
            pathNewFile = path.join(pathNewFile, nameFile);
        }
        if (await isAccessPath(pathFile)) {
            await stat(pathNewFile).then(() => {
                console.log('Operation failed: file exists');
            }).catch(async () => {
                await writeFile(pathNewFile, '', (err) => {
                    if (err) {
                        console.log('1 Operation failed');
                        return;
                    }
                });
                const readStream = fs.createReadStream(pathFile, 'utf8');
                const writeStream = fs.createWriteStream(pathNewFile, 'utf8');
                pipeline(readStream, writeStream, async(err) => {
                    if (err) {
                        console.log('Operation failed');
                        return;
                    }
                    await unlink(pathFile).catch(() => {
                        console.log('Operation failed');
                    });
                });
            });
        } else {
            console.log('Operation failed');
        }
    } catch {
        console.log('Operation failed');
    }
}

export const handlerRm = async(operation) => {
    const arrParamOperation = parseOperation(operation.trim());
    if (arrParamOperation.length != 2) {
        console.log('Invalid input');
        return;
    }
    const pathFile = path.join(getCurrentPath(), arrParamOperation[1]);

    try {
        await unlink(pathFile).catch(() => {
            console.log('Operation failed');
        });
    } catch {
        console.log('Operation failed');
    }
}
