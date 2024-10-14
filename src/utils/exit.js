import process from 'node:process';

export const exit = (userName) => {
    process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!`);
    process.exit();
}
