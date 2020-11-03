import * as amqp from 'amqplib/callback_api'
import { log } from './../../logger'

export async function getData(queue) {
    let data = null
    return await new Promise((resolve, reject) => {
        data = amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`,
            function(error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(async function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue(queue, {
                        durable: true
                    });
                    channel.prefetch(1);
                    channel.consume(queue, function(msg) {
                        console.log(msg)
                        resolve({
                            status: true,
                            data: msg
                        })
                        channel.ack(msg)
                    });
                });
            });
    })
}

export async function sendData(queue, data) {
    let status = null
    try {
        status = await new Promise(async(resolve, reject) => {
            amqp.connect(`amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}:${process.env.RABBIT_PORT}`,
                function(error0, connection) {
                    if (error0) {
                        reject(error0)
                        return
                    }
                    log('Подключился к RabbitMQ')
                    connection.createChannel(function(error1, channel) {
                        if (error1) {
                            reject(error1)
                            return
                        }
                        channel.assertQueue(queue, {
                            durable: true
                        });
                        channel.prefetch(1);
                        channel.sendToQueue(queue,
                            Buffer.from(JSON.stringify(data)), {
                                headers: {
                                    time: new Date(Date.now()).toLocaleString()
                                }
                            });
                        log('Отправил данные ')
                        resolve(true);
                    });
                })
        })
    } catch (err) {
        return {
            status: false,
            error: err
        }
    }
    return {
        status: status,
        error: null
    }
}