import { access } from 'node:fs/promises';

export const parseOperation = (operation) => {
    let arrArgs = [];
    if (operation.indexOf('"') != -1) {
        arrArgs = operation.split('"');
        arrArgs.pop();
    } else if (operation.indexOf("'") != -1) {
        arrArgs = operation.split("'");
        arrArgs.pop();
    } else {
        arrArgs = operation.split(" ");
    }

    return arrArgs;
}

export const parseOperation3Args = (operation) => {
    let arrArgs = [];
    if (operation.indexOf('"') !== -1 && operation.indexOf("'") !== -1) return arrArgs;
    if (operation.indexOf('"') !== -1) {
        arrArgs = operation.split('"');
    } else if (operation.indexOf("'") !== -1) {
        arrArgs = operation.split("'");
    } else {
        arrArgs = operation.split(" ");
    }
    arrArgs = arrArgs.filter((item) => {
        if (item !== '' && item !== ' ') return item;
    })
    if (arrArgs[0].trim().indexOf(' ') !== -1) {
        let buff = (arrArgs[0].trim()).split(' ');
        buff.push(arrArgs[1]);
        return buff;
    }
    return arrArgs;
}

export const isAccessPath = async (path) => {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}
