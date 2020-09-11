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

import {EpisodeDoc, EpisodeModel} from "../db/models/episodes"
import { Request } from "express";

@Controller()
export class EpisodeApiController {

   

    @Get("/api/episode")
    //@Authorized("user")
    async getEpisode(@Req() req: any, @Res() res: any) {
        const episode = await EpisodeModel.find(req.query);

        //404
        if (episode[0] == undefined) {
            res.status(404);
            return {
                message: "Episode Not found"
            }
        }

        return JSON.parse(JSON.stringify(episode))
    }

    @Get("/api/episode/:id")
    //@Authorized("user")
    async getAnimeById(@Param("id") id: string, @Res() res: any) {
        const episode = await EpisodeModel.find(
            {_id: id}
        );

        //404
        if (episode[0] == undefined) {
            res.status(404);
            return {
                message: "Episode Not found"
            }
        }

        return JSON.parse(JSON.stringify(episode))
    }

    
    @Delete("/api/episode/:id")
    //@Authorized("admin")
    async deleteById(@Param("id") id: string, @Res() res: any) {

        const removedEpisode = await EpisodeModel.remove({
            _id: id
        });

        //404
        if (removedEpisode == undefined) {
            res.status(404);
            return {
                message: "Episode Not found"
            }
        }

        return JSON.stringify({
            message: "Episode is removed",
            episode: removedEpisode
        })
    }

    @Patch("/api/episode/:id")
    //@Authorized("admin")
    async update(@Body() body: any, @Param("id") id: string) {

        const res = await EpisodeModel.update({
            _id: id
        }, {
            $set: body
        });

        return JSON.stringify(res);
    }


    @Post('/api/episode')
    //@Authorized("admin")
    async createAnime(@Body({
            validate: true
        }) episode: EpisodeDoc,
        @Req() req: Request, @Res() res: any) {
            console.log(episode);

        const newAnime = new EpisodeModel(
            episode
        );


        const savedEpisode = await newAnime.save()
            .then((data: any) => {

            })
            .catch((err: any) => {
                return err;
            });

        return {
            message: "episode saved."
        };
    }

}