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
    QueryParam, CurrentUser
} from "routing-controllers";

import {AnimeDoc, AnimeModel} from "../db/models/anime"
import { Request } from "express";
import { EpisodeDoc, EpisodeModel } from "../db/models/episodes";
import { User } from "../model/User";
import { UserDoc } from "../db/models/user";
import { Console } from "console";
import c from "config";
import { model } from "mongoose";

@Controller()
export class AnimeApiController {

    
    @Get("/api/echo")
    //@Authorized("user")
    async hello(@Req() req: any, @Res() res: any) {
        return "hello "
    }
   

    // TODO: anime term
    @Get("/api/anime")
   // @Authorized("user")
    async getAnimes(@Req() req: any, @Res() res: any, @QueryParam('term') term: string, @QueryParam('limit') limit: number,@QueryParam('page') page: number ) {
        const startIndex = (page -1) * limit;
        const endIndex = page * limit;

        console.log((await AnimeModel.collection.stats()).count)
        let animes;
       if(term != undefined){
        animes = await AnimeModel.find({title: {$regex:  new RegExp(term, 'i' )}}).limit(limit).skip(startIndex).exec();
       }else {
        animes = await AnimeModel.find().limit(2);
       }
        //404
        if (animes[0] == undefined) {
            res.status(404);
            return {
                message: "Anime Not found"
            }
        }

        let collectionSize = (await AnimeModel.collection.stats()).count;

        return {
            data: JSON.parse(JSON.stringify(animes)),
            meta: {
                collectionSize: collectionSize
            }
        
        }
    }

    @Get("/api/anime/:id")
    //@Authorized("user")
    async getAnimeById(@Param("id") id: string, @Res() res: any) {
        const anime = await AnimeModel.find(
            {_id: id}
        );

        //404
        if (anime[0] == undefined) {
            res.status(404);
            return {
                message: "Anime Not found"
            }
        }

        //increment viewCount
        const updateCount = await await AnimeModel.update({
            _id: id
        }, {
            $inc: {viewCount: 1}
        });

        console.log( "count", anime[0].viewCount)

        return JSON.parse(JSON.stringify(anime))
    }

    
    @Delete("/api/anime/:id")
    @Authorized("user")
    async deleteById(@Param("id") id: string, @Res() res: any) {

        const removedProfile = await AnimeModel.remove({
            _id: id
        });

        //404
        if (removedProfile == undefined) {
            res.status(404);
            return {
                message: "Anime Not found"
            }
        }

        return JSON.stringify({
            message: "Anime is removed",
            profile: removedProfile
        })
    }

    @Patch("/api/anime/:id")
    //@Authorized("user")
    async update(@Body() body: any, @Param("id") id: string) {

        const res = await AnimeModel.update({
            _id: id
        }, {
            $set: body
        });

        return JSON.stringify(res);
    }

    @Patch("/api/anime/:id/subscribe")
    //@Authorized("user")
    async subscribers(@Body() body: any, @Param("id") id: string, @CurrentUser({
        required: true
    }) user: UserDoc) {
        console.log(user)

        if(body.subscribe){
            const res = await AnimeModel.update({
                _id: id
            }, {
                $addToSet: {subscribers: user._id}
            });
            return JSON.stringify({message: "subscribed"});
        }else{
            const res = await AnimeModel.update({
                _id: id
            }, {
                $pull: {subscribers: user._id}
            });

            return JSON.stringify({message: "unsubscribed"});
        }

    }


    @Post('/api/anime')
    //@Authorized("admin")
    async createAnime(@Body({
            validate: true
        }) anime: AnimeDoc,
        @Req() req: Request, @Res() res: any) {
            console.log(anime);

        const newAnime = new AnimeModel(
            anime
        );


        const savedAnime = await newAnime.save()
            .then((data: any) => {

            })
            .catch((err: any) => {
                return err;
            });

        return {
            message: "Anime saved."
        };
    }


}