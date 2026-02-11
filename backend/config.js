import { config } from "dotenv";
import e from "express";
import http from "http";
import https from "https";
import fs from "fs";
import { connect } from "mongoose";
import dns from 'dns'
dns.setServers(['1.1.1.1', '8.8.8.8']);

config();

const DB_LINK = process.env.DB_LINK;
const HTTP_PORT = process.env.HTTP_PORT;
const HTTPS_PORT = process.env.HTTPS_PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

export const app = e();

const options = {
  key: fs.readFileSync("./cert.key"), // Path to your private key file
  cert: fs.readFileSync("./cert.crt"), // Path to your certificate file
};

export const createServers = async () => {
  http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP server running at port: ${HTTP_PORT}`);
  });
  try {
    https.createServer(options, app).listen(HTTPS_PORT, () => {
      console.log(`HTTPS server running at port: ${HTTPS_PORT}`);
    });
  } catch (err) {
    console.error(`HTTPS server creation failed\n
        Use HTTP server at port: ${HTTP_PORT} instead`);
  }
};

// Connect MongoDB
export const dbConnect = async () => {
  connect(DB_LINK)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
};
