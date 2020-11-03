import fs from 'fs'
import appRoot from 'app-root-path'

export function log(data, member = 'Сервер') {
    const now = new Date(Date.now()).toLocaleDateString() + ' ' + new Date(Date.now()).toLocaleTimeString()
    const logString = member + ' | ' + now + ' | ' + data

    console.log(logString)

    const filePath = `${ appRoot }/logs/newser_server.txt`
    try {
        if (!fs.existsSync(filePath)) {
            fs.open(filePath, 'w', (err) => {
                if (err) throw err;
            });
        }
        fs.appendFileSync(filePath, logString + '\n');
    } catch (err) {
        console.log(err)
    }
    return logString
}