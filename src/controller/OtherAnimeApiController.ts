import {
    Controller,
    Get,
    Post,
    Req,
    Delete,
    Param,
    Put,
    Body,
    Res,
    Authorized,
    Patch,
    QueryParam
} from "routing-controllers";

import {AnimeDoc, AnimeModel} from "../db/models/anime"
import { Request } from "express";
import { resolve } from "path";
import { rejects } from "assert";
import { request } from "http";
var unirest = require("unirest");

@Controller()
export class OtherApiController {

   

    @Get("/api/jikan")
    //@Authorized("user")
    async getAnimeById(@QueryParam("search") search: string, @Res() res: any) {
      

    var req = unirest("GET", "https://jikan1.p.rapidapi.com/search/anime");

    req.query({
    	"q": search
    });

    req.headers({
    	"x-rapidapi-host": "jikan1.p.rapidapi.com",
    	"x-rapidapi-key": "b31986522amshe155b9962276197p18265bjsnb9573787391e",
    	"useQueryString": true
    });

    let p = new Promise((resolve, rejects)=>{

    req.end(function (res: any) {
        if (res.error) rejects('error')
        resolve(res.body)    
    });

})

return await p;
        //return "not found"
    }

    

}