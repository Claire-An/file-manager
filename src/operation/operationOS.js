import os from 'os';

export const handlerOs = async(operation) => {
    const paramOperation = operation.trim().split(' ')[1];
    switch (paramOperation) {
        case '--EOL':
            console.log(JSON.stringify(os.EOL));
            break;
        case '--cpus':
            let result = os.cpus();
            console.log(`Count CPUs: ${result.length}`);
            result = result.map((item) => {
                console.log(`model: ${item.model}, speed: ${(item.speed/1000).toFixed(2)} GHz`);
            });
            break;
        case '--homedir':
            console.log(os.homedir());
            break;
        case '--username':
            console.log(os.userInfo().username);
            break;
        case '--architecture':
            console.log(os.arch());
            break;
        default: process.stdout.write('Invalid input\n');;
    }
}
