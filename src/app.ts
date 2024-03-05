import express from 'express'
import usersRouters from './routers/users'
import path from 'path';
import config from 'config';

const server = express();
server.set('views', path.resolve(__dirname,'views'));
server.set('view engine','ejs');

server.use('/users', usersRouters)

const port = config.get<number>('app')

server.listen(8080, ()=>{
    console.log('started server...')
})