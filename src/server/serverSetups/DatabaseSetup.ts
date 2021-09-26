
import { Express } from "express";
import mongoose from "mongoose";
import {MyLogger} from "../../services/Logger";
import {IServerSetup} from "./IServerSetup";

export class DatabaseSetup implements IServerSetup {

    async setup(app: Express) {
        // @ts-ignore
        const DB_URI: string = process.env.DB_URI;

        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => {
            MyLogger.debug("[DB] connected to DB");
        });
    }

}
