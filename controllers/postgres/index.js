import pgPromise from 'pg-promise';
import store from './../../state'

export async function PGConnect() {
    const pgp = pgPromise();
    const db = pgp(`postgres://${process.env.PG_USERNAME}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`);
    console.log(store.getCli().green(`Успешно подключился к ${process.env.PG_DB}`))
    return db
}

export async function getMercurySelectors(domain) {
    let tableName = "resources"
    let db = await store.getDB()
    let res = await db.query(`SELECT *  FROM ${tableName} WHERE name_resource='${domain}'`)
    return {
        status: true,
        data: res
    }
}

export async function sendMercurySelectors(data) {
    // let res = await store.getDB().query(`INSERT INTO ${tableName} WHERE name_resource='${domain}'`)
}