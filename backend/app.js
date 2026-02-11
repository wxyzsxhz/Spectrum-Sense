import { json } from "express";
import router from "./routes.js";
import { app, createServers, dbConnect, CLIENT_ORIGIN } from "./config.js";
import cors from "cors";

const corsOptions = {
  origin: CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
console.log(corsOptions.origin);

app.use(cors(corsOptions));
app.use(json());
app.use("/", router);

createServers();
dbConnect();
