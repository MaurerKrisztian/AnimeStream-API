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
    Patch
} from "routing-controllers";

import {AnimeDoc, AnimeModel} from "../db/models/anime"
import { Request } from "express";
import { EpisodeDoc, EpisodeModel } from "../db/models/episodes";

@Controller()
export class AnimeApiController {

    
    @Get("/api/echo")
    //@Authorized("user")
    async hello(@Req() req: any, @Res() res: any) {
     
        return "echo"
    }
   

    @Get("/api/anime")
    //@Authorized("user")
    async getAnimes(@Req() req: any, @Res() res: any) {
        const profiles = await AnimeModel.find(req.query);

        //404
        if (profiles[0] == undefined) {
            res.status(404);
            return {
                message: "Profile Not found"
            }
        }

        return JSON.parse(JSON.stringify(profiles))
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
                message: "Profile Not found"
            }
        }

        return JSON.parse(JSON.stringify(anime))
    }

    
    @Delete("/api/anime/:id")
    //@Authorized("admin")
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
    //@Authorized("admin")
    async update(@Body() body: any, @Param("id") id: string) {

        const res = await AnimeModel.update({
            _id: id
        }, {
            $set: body
        });

        return JSON.stringify(res);
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