import { config } from "dotenv";
import e from "express";
import http from 'http';
import https from 'https';
import fs from 'fs';
import { connect } from 'mongoose';
import dns from 'dns'

config();
dns.setServers(['1.1.1.1','8.8.8.8']);

const DB_LINK = process.env.DB_LINK;
const HTTP_PORT = process.env.HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;

export const app = e();

const options = {
  key: fs.readFileSync('./localhost-key.pem'), // Path to your private key file
  cert: fs.readFileSync('./localhost.pem') // Path to your certificate file
};

export const createServers = async () => {
    http.createServer(app).listen(HTTP_PORT, ()=>{
        console.log(`HTTP server running at port: ${HTTP_PORT}`)
    });
    try{
        https.createServer(options, app).listen(HTTPS_PORT, ()=>{
            console.log(`HTTPS server running at port: ${HTTPS_PORT}`)
        });
    }catch(err){
        console.error(`HTTPS server creation failed\n
        Use HTTP server at port: ${HTTP_PORT} instead`)
    }
    
}

// Connect MongoDB
export const dbConnect = async () => {
  await connect(DB_LINK)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));  
}