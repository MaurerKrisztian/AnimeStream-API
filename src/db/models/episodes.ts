export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const episodeSchema = createSchema({
        animeId: Type.string({require: false}),
        title: Type.string({require: false}), // ha van resz cim
        season: Type.string({require: false}),
        part: Type.string({require: false}), // pl 12 resz
        links: Type.array().of({
            link: Type.string({require: false}),
            quality: Type.string({require: false}),
            storageName: Type.string({require: false}),
        })
})

export const EpisodeModel = typedModel('episode', episodeSchema);
export type EpisodeDoc = ExtractDoc<typeof episodeSchema>;

/*
           {
                "title": "episode 1",
                season: "1",
                part: "1",
                "links": [
                    {
                    "link": "episode 1 lik 1",
                    "quality":  "1080p",
                    "storageName": "indavideo"
                    }
                ]
             }

*/