import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";

import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";

import "./config/passport";
import router from "./routes";

dotenv.config();

export const app: Express = express();

// initialize subscribers
import "./subscribers";

import {authenticateGoogleToken} from "./middlewares/PostmanGoogleAuth.middleware";

app.use(morgan("common"));

//parse JSON bodies
app.use(express.json());

// initialize cookie-session to store user session data
app.use(
  cookieSession({
    name: "session",
    keys: ["supersecretkeyforXENOassignment"],
    maxAge: 24 * 60 * 60 * 100,
  })
);


// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// enable cors
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

// authenticateGoogleToken to parse google id token from postman
app.use(authenticateGoogleToken);

// routes
app.use(router);
