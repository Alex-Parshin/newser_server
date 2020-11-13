'use strict'

class State {
    constructor() {
        if (State.exists) return State.instance

        this.server = null
        this.db = null
        this.cli = null

        State.exists = true
        State.instance = this
    }

    setServer(data) {
        this.server = data
    }

    setDB(data) {
        this.db = data
    }

    setCli(data) {
        this.cli = data
    }

    getServer() {
        return this.server
    }

    getDB() {
        return this.db
    }
    getCli() {
        return this.cli
    }

}

export default new State()