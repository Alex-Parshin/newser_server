import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cli from 'cli-color'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import state from './state'
import { PGConnect } from './controllers/postgres'
import { checkQueueFile } from './controllers/query'
import apiHandler from './controllers/api'
import socketHandler from './controllers/socket'
import { log } from './logger'
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use('/api', apiHandler)

const port = process.env.SERVER_PORT

const server = app.listen(port, () => {
    log(`Сервер запущен на http://localhost:${port}`)
})

state.setCli(cli)
state.setServer(server)
socketHandler()
state.setDB(await PGConnect())
checkQueueFile()

app.use(express.static(`${path.resolve()}/public/`));
app.get(/.*/, (_, res) => {
    res.sendFile(`${path.resolve()}/public/index.html`);
})