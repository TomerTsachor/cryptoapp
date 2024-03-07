import express from 'express'
import usersRouters from './routers/users'
import path from 'path';
import config from 'config';
import errorHandler from './middlerwares/error/error-handler';
import session from 'express-session';
import auth from './middlerwares/github-auth'

import usersRouter from './routers/users';
import guestsRouter from './routers/guests';
import githubRouter from './routers/github';

const server = express();
server.set('views', path.resolve(__dirname,'views'));
server.set('view engine','ejs');


server.use(session({
    secret:'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))

server.use(auth.initialize())
server.use(auth.session())

server.use(express.urlencoded())

// routering
server.use('/', guestsRouter)
server.use('/users', usersRouters)
server.use('/github', githubRouter)

//error middlewares
server.use(errorHandler);


const port = config.get<number>('app')
server.listen(port, ()=>{
    console.log('started server...')
})