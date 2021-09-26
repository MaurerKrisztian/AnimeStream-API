import {getLogger, Logger} from "log4js";

export class MyLogger {
    static logger: Logger = getLogger();

    static getPre(from?: string) {
        return from ? "[" + from + "] " : ""
    }

    // level: trace
    static trace(message: string, from?: string): void {
        this.logger.trace(this.getPre(from) + message);
    }

    // level: debug
    static debug(message: string, from?: string): void {
        this.logger.debug(this.getPre(from) + message);
    }

    // level: info
    static info(message: string, from?: string): void {
        this.logger.info(this.getPre(from) + message);
    }

    // level: warn
    static warn(message: string, from?: string): void {
        this.logger.warn(this.getPre(from) + message);
    }

    // level: error
    static error(message: string, from?: string): void {
        this.logger.error(this.getPre(from) + message);
    }

    // level: fatal
    static fatal(message: string, from?: string): void {
        this.logger.fatal(this.getPre(from) + message);
    }

    static prettyJsonString(obj: any): string {
        return "\n" + JSON.stringify(obj, null, "\t");
    }

}
