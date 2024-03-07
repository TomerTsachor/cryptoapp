import util from 'util';
import config from 'config';
import mysql from 'mysql2';
import mongoose from "mongoose";
import getModel from './models/user-symbol/factory';
import getSymbolValueModel from './models/symbol-value/factory';
import axios from 'axios';
import cheerio from 'cheerio'
import { io } from 'socket.io-client'

// init
// connect to socket io
const socket = io(`ws://${config.get<string>('worker.io.host')}:${config.get<string>('worker.io.port')}`)

// connect to sql
const connection = mysql.createConnection(config.get('mysql'))
const connect = util.promisify(connection.connect).bind(connection);
const query = util.promisify(connection.query).bind(connection);

//connect to mongo
const host = config.get<string>('mongo.host')
const port = config.get<string>('mongo.port')
const database = config.get<string>('mongo.database')


// function scrape
async function scrape(symbol: string){
    console.log(`scrapping ${symbol}$`)
    // fetch data from google
    const response = await axios(`https://www.google.com/finance/quote/${symbol}-USD`);
    const html = response.data;
    const $ = cheerio.load(html)
    const value = Number($('.YMlKec.fxKbKc').text().replace(',',''));
    console.log(value)

    // save in mongo
    await getSymbolValueModel().add({
        symbol,
        value,
        when: new Date()
    })

    // notify clients
    socket.emit('update from worker',{
        symbol,
        value
    });
    return;
}


// loop
// get symbols from mysql
// scrape all symbols
// set timeout for next cycle

async function work(){
    try{
        const symbols = await getModel().getUniqueSymbols();
        await Promise.allSettled(symbols.map(scrape))
    } catch(err){
        console.log(err);
    } finally{
        setTimeout(work, config.get<number>('worker.interval'))
    }
}

(async () => {
    // await Promise.all([
    //     connect(),
    //     mongoose.connect(`mongodb://${host}:${port}/${database}`)
    // ])
    work();
})();