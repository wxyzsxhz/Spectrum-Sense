import { json } from 'express';
import router from './routes.js';
import { app, createServers, dbConnect, CLIENT_ORIGIN } from './config.js';
import cors from 'cors';


const corsOptions = {
    origin : CLIENT_ORIGIN
}
app.use(cors(corsOptions));
app.use(json());
app.use('/',router);

createServers();
dbConnect();





