import fs from 'fs'
import appRoot from 'app-root-path'
import { log } from './../logger'

export function drawPoints(point) {
    const filePath = `${appRoot}/data/points.json`;
    if (!fs.existsSync(filePath)) {
        fs.open("queries.json", "w", (err) => {
            if (err) throw err;
            fs.writeFileSync(filePath, "[]");
        });
    }
    const points = JSON.parse(fs.readFileSync(filePath))
    points.push(point);
    fs.writeFileSync(filePath, JSON.stringify(points));
}

export function getConfig() {
    const filePath = `${appRoot}/data/configuration.json`
    return JSON.parse(fs.readFileSync(filePath))
}

export function setConfig(config) {
    const filePath = `${appRoot}/data/configuration.json`;

    try {
        fs.writeFileSync(filePath, JSON.stringify(config))
        log(`Конфигурация успешно обновлена`)
    } catch (err) {
        log(`Ошибка получения конфигурации: ${err}`)
        return false
    }
    return true
}

export function checkConfigFile() {
    const filePath = `${appRoot}/data/configuration.json`;
    try {
        if (!fs.existsSync(filePath)) {
            fs.open(filePath, 'w', (err) => {
                if (err) throw err;
                fs.writeFileSync(filePath, JSON.stringify(configuration));
                log('Создан конфигураций запросов!');
            });
        } else {
            log('Файл запросов уже существует!')
        }
    } catch (err) {
        log(err)
    }
}

export function getQueryFromFile() {
    let filePath = `${appRoot}/data`
    let data = JSON.parse(fs.readFileSync(`${filePath}/${process.env.QUEUE_FILE}.json`, 'utf-8'))
    if (data.length === 0) {
        log('Внутренняя очередь пуста. Обрабатываю данные с сервера')
        return null
    }
    let result = {
        query: data[0].query,
        id_request: Number(data[0].id_request),
        engines: data[0].engines
    }
    data = data.filter(query => query.query !== result.query)
    fs.writeFileSync(`${filePath}/${process.env.QUEUE_FILE}.json`, JSON.stringify(data))
    return result
}

export function checkQueueFile() {
    let filePath = `${appRoot}/data`
    try {
        if (!fs.existsSync(`${filePath}/${process.env.QUEUE_FILE}.json`)) {
            fs.open(`${filePath}/queries.json`, 'w', (err) => {
                if (err) throw err;
                fs.writeFileSync(`${filePath}/queries.json`, '[]');
                log('Создан файл запросов!');
            });
        } else {
            log('Файл запросов уже существует!')
        }
    } catch (err) {
        log(err)
    }
}

export function addQueryToQueue({ query, id_request, engine }) {
    let filePath = `${appRoot}/lib/data`
    let engines = {}
    let data = JSON.parse(fs.readFileSync(`${filePath}/${process.env.QUEUE_FILE}.json`, 'utf-8'))
    switch (engine) {
        case 'Yandex.News':
            engines = { 4: true }
            break
        case 'Rambler.News':
            engines = { 7: true }
            break
        case 'Google.News':
            engines = { 3: true }
            break
    }

    data.push({
        query: query,
        id_request: id_request > 0 ? id_request : getRandom(0, 1000),
        engines: engines
    })
    fs.writeFileSync(`${filePath}/${process.env.QUEUE_FILE}.json`, JSON.stringify(data))
    return 0
}

export function addDataToLogs(logString) {
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
}