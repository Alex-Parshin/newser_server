import express from 'express'

import { getMercurySelectors, sendMercurySelectors } from './../postgres'
import { getData, sendData } from './../rabbitmq'
import { getQuery } from './../query'
import { getConfig } from './../../filemanager'
import { log } from './../../logger'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Welcome to API handler')
})

router.post('/drawPoint', (req, res) => {
    res.send('Success')
})

router.get('/getQuery/:source', async(req, res) => {
    let source = req.params.source
    res.json(await getQuery(source))
})

router.get('/getConfig', (req, res) => {
    let config = getConfig()
    res.json(config)
})

/** RabbitMQ API Section */
router.get('/getDataFromRabbitMQ/:queue', async(req, res) => {
    const queue = req.params.queue
    const result = await getData(queue)
    console.log(result)
    if (result.status) res.status(200).json(result.data)
    else res.status(201).end(`Ошибка отправки данных в очередь ${queue}: ${result.error}`)
})

router.post('/sendDataToRabbitMQ', (req, res) => {
    const queue = req.body.queue
    const data = req.body.data
    const result = sendData(queue, data)
    if (result.status) {
        res.status(200).end(`Данные успешно отправлены в очередь ${queue}`)
        log(`Данные успешно отправлены в очередь ${queue}`)
    } else {
        res.status(201).end(`Ошибка отправки данных в очередь ${queue}: ${result.error}`)
        log(`Ошибка отправки данных в очередь ${queue}: ${result.error}`)
    }
})

/** PostgreSQL API Section */
router.get('/getMercurySelectors/:domain', async(req, res) => {
    const result = await getMercurySelectors(req.params.domain)
    if (result.status) res.status(200).json(result.data)
    else res.status(201).end(`Ошибка получения данных: ${result.error}`)
})

router.post('/sendMercurySelectors', (req, res) => {
    const result = sendMercurySelectors(req.body.data)
    if (result.status) res.status(200).end(`Селекторы для домена ${req.body.data.domain} успешно записаны в базу`)
    else res.status(201).end(`Ошибка записи селекторов: ${ressult.error}`)
})

/***************************/

export default router