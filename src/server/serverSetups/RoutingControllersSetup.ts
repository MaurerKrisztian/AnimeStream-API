import "reflect-metadata";
import { IServerSetup } from "./IServerSetup";
import { Express } from "express";
import {Action, useContainer, useExpressServer} from "routing-controllers";
const jwt = require('jsonwebtoken')
import {UserModel} from "../../db/models/user";
import {OtherApiController} from "../../controller/OtherAnimeApiController";
import {AnimeApiController} from "../../controller/AnimeApiContoller";
import {ProfileApiController} from "../../controller/ProfileApiController";
import {UserApiController} from "../../controller/UserApiController";
import {LoginApiController} from "../../controller/LoginApiController";
import {EpisodeApiController} from "../../controller/EpisodeApiController";
require("dotenv/config");
export class RoutingControllersSetup implements IServerSetup {
    setup(app: Express): any {

        useExpressServer(app, {
            authorizationChecker: async (action: Action, roles: string[]) => {

                //get the token
                const authorization = action.request.headers['authorization'];
                if (authorization == undefined) return false;

                const token = authorization.split(' ')[1];

                if (token == undefined){
                    action.response.status(401)
                    return false
                }

                //verify token
                const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");

                if (verifiedToken == undefined) {
                    action.response.status(401)
                    return false;
                }

                //get the user
                const user = await UserModel.findOne({
                    _id: verifiedToken._id,
                    email: verifiedToken.email
                });

                if (user == undefined){
                    action.response.status(401)
                    return false;
                }

                const userRoles = user.roles;

                if (user && !roles.length)
                    return true;

                if (user && userRoles != undefined && roles.find(role => userRoles.indexOf(role) !== -1)) {
                    return true;
                } else {
                    action.response.status(401)
                    return false;
                }
            },
            currentUserChecker: async (action: Action) => {

                const authorization = action.request.headers["authorization"];
                if (authorization == undefined) return undefined;

                const token = authorization.split(' ')[1];

                if (token == undefined)
                    return undefined;

                //verify token
                const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret");

                if (verifiedToken == undefined) {
                    return undefined;
                }

                //get the user
                const user = await UserModel.findOne({
                    _id: verifiedToken._id,
                    email: verifiedToken.email
                });

                if (!user) return undefined;

                return user;
            },
            defaults: {
                nullResultCode: 404,
                undefinedResultCode: 204,
            },
            cors: {
                origin: ['localhost:3000', 'http://localhost:4000','http://localhost:4200', 'https://animestream-2c543.web.app'],
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                credentials: true
            },
            classTransformer: true,
            controllers: [OtherApiController, AnimeApiController,ProfileApiController, UserApiController, LoginApiController, EpisodeApiController]
        });

    }

}
