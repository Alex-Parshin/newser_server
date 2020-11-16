'use strict'

import axios from 'axios'
import { log } from './../logger'
import { getQueryFromFile } from './../filemanager'

export async function serverProvider() {
    log("Получаю данные с сервера")
    let queryData = await axios.get(process.env.QUERY_URL)
    log(`Отправил запрос ${queryData.data.query}`)
    return {
        query: queryData.data.query,
        id_request: queryData.data.id_request
    }
}

export async function localFileProvider() {
    return getQueryFromFile()
}