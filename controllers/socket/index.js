import store from './../../state'
import socket from 'socket.io'
import { log } from './../../logger'
import { sendData } from './../rabbitmq'

let connections = []

export default function socketManager() {

    const io = socket(store.getServer())
    io.on('connect', socket => {
        socket.on('who_am_i', (data) => {

            connections.push({
                socket: socket,
                name: setMemberName(data)
            })

            log(`${setMemberName(data)} подключился!`)
            socket.emit('startBot', { source: 'server', server: 'server', pages: 1, url: process.env.QUERY_URL, engines: { 7: true, 3: true, 4: true } })
        })

        socket.on('log', (data) => {
            let member = getMemberViaSocket(socket).name
            log(data, member)
        })

        socket.on('startBot', (memberName, { source, server, pages, url, engines }) => {
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('startBot', { source, server, pages, url, engines })
        })

        socket.on('toRabbit', (data) => {
            sendData(data.queue, data.message)
        })

        socket.on('disconnect', () => {
            let member = getMemberViaSocket(socket).name
            log(`${member} отключился!`)
        })
    })
}

function getMemberViaName(memberName) {
    return connections.find(member => member.name === memberName)
}

function getMemberViaSocket(memberSocket) {
    return connections.find(member => member.socket === memberSocket)
}

function setMemberName(name) {
    let counter = 0
    if (connections.find(member => member.name === name)) {
        if (name.split('_')[1]) {
            counter = Number(name.split('_')[2])
        }
        counter += 1
    }
    return `${name}_${counter}`.toString()
}