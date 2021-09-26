import { Express } from "express";

export interface IServerSetup {
    setup(app: Express): any;
}
