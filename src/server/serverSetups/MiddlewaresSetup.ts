import { IServerSetup } from "./IServerSetup";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const cors = require("cors");

export class MiddlewaresSetup implements IServerSetup {
    setup(app: Express): any {
        app.use(cors({
            origin: "*",
            credentials: true
        }));
        app.use(cookieParser());
        app.use(express.static('/public'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }))
    }

}
