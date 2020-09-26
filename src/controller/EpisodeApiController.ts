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
import {AnimeDoc, AnimeModel} from "../db/models/anime"
import {UserDoc, UserModel} from "../db/models/user"

import { Request } from "express";
import { User } from "../model/User";

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

    @Get("/api/episode/anime/:id")
    //@Authorized("user")
    async getAnimeEpisodesById(@Param("id") id: string, @Res() res: any) {
        const episode = await EpisodeModel.find(
            {animeId: id}
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

        const episodeFound = await EpisodeModel.findOne({
            animeId: episode.animeId,
            season: episode.season,
            part: episode.part
        });

        if(episodeFound?.links != undefined){
            let newLinks = episode.links?.concat(episodeFound.links);
            
            const updateEpisodeLiks = await EpisodeModel.update({
                _id: episodeFound._id
            },{ $set: {links: newLinks}});

            //console.log(updateEpisodeLiks)
            return "links updated"
        }

        const newAnime = new EpisodeModel(
            episode
        );

        //sendd notification
            //get episode anime
                //get anime subscripers id 
                    //send notif
        this.notifyUsers(episode);

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

    async notifyUsers(episode: EpisodeDoc){
        const anime = await AnimeModel.findOne({_id: episode.animeId});
        if(anime == undefined){
            return undefined;
        }

        const subscribedUserIds = anime.subscribers; 
    

        subscribedUserIds?.forEach(async (subscriberId)=>{
            console.log(subscriberId)
            const res = await UserModel.update({
                _id: subscriberId
            }, {
                $push: {
                    notification: {
                        message: 'new episode:' + anime.title + " s: " + episode.season + " ep: "+ episode.part + "</a>",
                        link: '/anime/'+anime._id,
                        date: "123.123"
                    }
                }
            });

            console.log({
                message: "new episode: " + anime.title + " s: " + episode.season + " ep: "+ episode.part,
                date: "123.123"
            })
            
        })



    }

    concatLinks(episode: EpisodeDoc, episodeFound: EpisodeDoc){
        if(episodeFound.links == undefined) return;

        return episode.links?.concat(episodeFound.links);
    }

}