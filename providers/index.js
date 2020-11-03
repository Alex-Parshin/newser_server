'use strict'

import axios from 'axios'
import fs from 'fs'
import appRoot from 'app-root-path'
import { log } from './../logger'

export async function serverProvider() {
    log("Получаю данные с сервера")
    let queryData = await axios.get(process.env.QUERY_URL)
    log("Отправил данные")
    return {
        query: queryData.data.query,
        id_request: queryData.data.id_request
    }
}

export async function localFileProvider() {
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