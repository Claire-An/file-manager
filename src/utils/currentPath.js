import os from 'os';

const homePath = os.homedir();

let currentPath = homePath;

export const setCurrentPath = (newPath) => {
    currentPath = newPath;  
};

export const getCurrentPath = () => {
    return currentPath;
}
