'use strict'

// NPM modules
import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
dotenv.config()

// Custom modules
import api from './api'
import socketManager from './socket'

// App setup
const HOST = process.env.SERVER_HOST
const PORT = process.env.SERVER_PORT;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use('/api', api)

const server = app.listen(PORT, HOST, () => {
    console.log(`Сервер запущен по адресу http://${HOST}:${PORT}`)
})

socketManager(server)

// Frontend
app.use(express.static("public"));
app.use('/static', express.static(path.join(path.resolve(), 'public')))

app.get(/.*/, (_, res) => {
    res.sendFile(`${path.resolve()}/public/index.html`);
})