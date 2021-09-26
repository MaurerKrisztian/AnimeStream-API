import express from "express";
import {IServerSetup} from "./serverSetups/IServerSetup";
import {DatabaseSetup} from "./serverSetups/DatabaseSetup";
import {LoggerSetup} from "./serverSetups/LoggerSetup";
import config from "config";
import {MyLogger} from "../services/Logger";
import {MiddlewaresSetup} from "./serverSetups/MiddlewaresSetup";
import {RoutingControllersSetup} from "./serverSetups/RoutingControllersSetup";
import {AdminLoaderSetup} from "./serverSetups/AdminLoaderSetup";

require("dotenv/config");

export class Server {
    app = express();

    setups: IServerSetup[] = [
        new LoggerSetup(),
        new DatabaseSetup(),
        new MiddlewaresSetup(),
        new RoutingControllersSetup(),
        new AdminLoaderSetup()
        // new SwaggerSetup()
    ];

    async start() {

        for (const setup of this.setups) {
            MyLogger.info("Loading: " + setup.constructor.name, "server setup")
            await setup.setup(this.app);
        }

        const PORT = process.env.PORT || config.get("App.server.port");
        this.app.listen(PORT, () => {
            MyLogger.info("App listening on port " + PORT, "server");
        });

    }

}
