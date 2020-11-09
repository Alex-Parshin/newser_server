import { localFileProvider, serverProvider } from './../../providers'
import appRoot from 'app-root-path'
import fs from 'fs'
import { log } from './../../logger'

export async function getQuery(source) {
    let result = {}

    switch (source) {
        case 'server':
            let localFileProviderData = await localFileProvider()
            if (localFileProviderData === null) {
                let serverProviderData = await serverProvider()
                result.query = serverProviderData.query
                result.id_request = serverProviderData.id_request
                result.engines = serverProviderData.engines
            } else {
                result.query = localFileProviderData.query
                result.id_request = localFileProviderData.id_request
                result.engines = localFileProviderData.engines
            }
            break
        case 'file':
            result.query = localFileProviderData.query
            result.id_request = localFileProviderData.id_request
            break;
        default:
            log('Источник не определен')
    }
    return result
}

export async function addQueryToQueue({ query, id_request, engine }) {
    let filePath = `${appRoot}/data`
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
        id_request: id_request > 0 ? id_request : Math.floor(Math.random() * (1000 - 0)) + 0,
        engines: engines
    })
    fs.writeFileSync(`${filePath}/${process.env.QUEUE_FILE}.json`, JSON.stringify(data))
    return 0
}