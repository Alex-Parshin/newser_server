import store from './../../state'
import socket from 'socket.io'
import { log } from './../../logger'

let connections = []

export default function socketManager() {
    const io = socket(store.getServer())
    io.on('connect', socket => {

        socket.on('who_am_i', (data) => {
            let new_name = setMemberName(data)

            connections.push({
                socket: socket,
                name: new_name
            })
            updateClients()
            log(`${new_name} подключился!`)
        })

        socket.on('log', (data) => {
            let member = getMemberViaSocket(socket).name
            log(data, member)
        })

        socket.on('start', (memberName, { source, pages, url, engines }) => {
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('startBot', { source, pages, url, engines })
        })

        socket.on('stop', memberName => {
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('stopBot')
        })

        socket.on('disconnect', () => {
            let member = getMemberViaSocket(socket).name
            updateClients()
            connections = connections.filter(member => member.socket !== socket)
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
    for (let i = 0; i < connections.length; i++) {
        if (connections[i].name.indexOf(name) !== -1) {
            name = connections[i].name
            counter = Number(name.split('_')[2]) + 1
            name = name.split('_').splice(0, 2).join('_')
        }
    }
    return `${name}_${counter}`.toString()
}

function updateClients() {
    if (getMemberViaName('newser_client_0')) {
        const memberSocket = getMemberViaName('newser_client_0').socket
        memberSocket.emit('update_clients', connections.map(member => member.name))
    }
}