import store from './../../state'
import socket from 'socket.io'
import { log } from './../../logger'

let connections = []

export default function socketManager() {
    const io = socket(store.getServer())
    io.on('connect', socket => {
        socket.on('who_am_i', (data) => {
            connections.push({
                socket: socket,
                name: setMemberName(data)
            })
            let names = connections.map(member => member.name)
            socket.broadcast.emit('update_clients', names)
            log(`${setMemberName(data)} подключился!`)
        })

        socket.on('log', (data) => {
            let member = getMemberViaSocket(socket).name
            log(data, member)
        })

        socket.on('startBot', (memberName, { source, server, pages, url, engines }) => {
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('startBot', { source, server, pages, url, engines })
        })

        socket.on('startMercury', memberName => {
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('startMercury')
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