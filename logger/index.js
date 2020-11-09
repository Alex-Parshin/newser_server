import fs from 'fs'
import appRoot from 'app-root-path'
import { addDataToLogs } from './../filemanager/index'

export function log(data, member = 'Сервер') {
    const now = new Date(Date.now()).toLocaleDateString() + ' ' + new Date(Date.now()).toLocaleTimeString()
    const logString = member + ' | ' + now + ' | ' + data

    console.log(logString)
    addDataToLogs(logString)

    return logString
}