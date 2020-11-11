import store from './../../state'
import socket from 'socket.io'
import { log } from './../../logger'

let connections = []
let clients = []

export default function socketManager() {
    const io = socket(store.getServer())
    io.on('connect', socket => {

        socket.on('who_am_i', (data) => {
            let new_name = setMemberName(data)

            connections.push({
                socket: socket,
                name: new_name
            })

            io.emit('update_clients', clients)
            log(`${new_name} подключился!`)
        })

        socket.on('log', (text) => {
            let member = getMemberViaSocket(socket).name
            log(text, member)
            text = `${ new Date(Date.now()).toLocaleDateString() } ${new Date(Date.now()).toLocaleTimeString()} | ${text}`
            io.emit('log', { member, text })
        })

        socket.on('start', (member, { source, pages, engines }) => {

            let memberName = member.name
            let url = process.env.QUERY_URL

            switch (source) {
                case 'Удаленный сервер':
                    source = 'server'
                    break
            }

            let enginesToBot = {
                3: false,
                4: false,
                7: false
            }

            for (let i = 0; i < engines.length; i++) {
                if (engines[0] === true) enginesToBot[3] = true
                if (engines[1] === true) enginesToBot[4] = true
                if (engines[2] === true) enginesToBot[7] = true
            }

            engines = enginesToBot

            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('start', { source, pages, url, engines })
        })

        socket.on('setStatus', (member, status) => {
            io.emit('getStatus', { member, status })
        })

        socket.on('restart', member => {
            let memberName = member.name
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('restart')
        })

        socket.on('stop', member => {
            let memberName = member.name
            const memberSocket = getMemberViaName(memberName).socket
            memberSocket.emit('stop')
        })

        socket.on('disconnect', () => {
            let member = getMemberViaSocket(socket).name
            clients = clients.filter(client => client !== member)
            io.emit('update_clients', clients)
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
    if (name.split('_')[1] !== 'client') {
        clients.push(`${name}_${counter}`)
    }

    return `${name}_${counter}`.toString()
}