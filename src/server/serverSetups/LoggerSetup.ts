import {IServerSetup} from "./IServerSetup";
import {Express} from "express";
import {MyLogger} from "../../services/Logger";

export class LoggerSetup implements IServerSetup {

    setup(app: Express): any {
        MyLogger.logger.level = "debug"
    }

}
