import pc from 'node:process';

export const getName = () => {
    try {
        const userName = pc.argv.find((val) => val.startsWith('--username')).split('=')[1];
        return userName;
    } catch {
        return 'Anonymous';
    }
};

getName();
