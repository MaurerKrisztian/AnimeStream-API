
import "reflect-metadata";
import {
    useExpressServer,
    Action
} from "routing-controllers";
import {
    UserApiController
} from "./src/controller/UserApiController";
import {
    LoginApiController
} from "./src/controller/LoginApiController";
import {
    ProfileApiController
} from "./src/controller/ProfileApiController";
import {ProfileModel} from "./src/db/models/profile"
import {UserModel} from './src/db/models/user';

import {DIprovider} from "./src/DI/DIprovider";
import {Fixtures} from "./src/fixture/Fixtures";
import config from 'config'
import mongoose from 'mongoose'
import { AnimeApiController } from "./src/controller/AnimeApiContoller";
import { OtherApiController } from "./src/controller/OtherAnimeApiController";
import { EpisodeModel } from "./src/db/models/episodes";
import { EpisodeApiController } from "./src/controller/EpisodeApiController";
import { Console } from "console";
const jwt = require('jsonwebtoken')
require('dotenv/config')

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT || config.get("App.server.port");

app.use(cookieParser());
app.use(express.static('/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))


if(DB_URI  != undefined) {
    
//mongodb connection
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log("connected to DB")
    })
}

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
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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
        const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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



const fixtures = DIprovider.injector.get(Fixtures);
fixtures.load().then(()=>{
 app.listen(PORT, () => {
    console.log("App listening on port " + PORT);
});
});
