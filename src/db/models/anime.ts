export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const animeSchema = createSchema({
        title: Type.string({ required: false }),
        description:Type.string({require: true}),
        imageLink:Type.string({require: true}),
        viewCount: Type.number(),
        subscribers: Type.array().of(Type.string())
})

export const AnimeModel = typedModel('anime', animeSchema);
export type AnimeDoc = ExtractDoc<typeof animeSchema>;

/*


const animeSchema = createSchema({
    title:Type.string({require: true}), // pl. dragon ball
    description:Type.string({require: true}),
    imageLink:Type.string({require: true}),
    series: Type.array().of({  //sorozatok belole
        title: Type.string({ required: false }), //pl dragon ball super
        episodes: Type.array().of({  // 1 epizod
            title: Type.string({require: false}),
            links: Type.array().of({
                link: Type.string({require: false}),
                quality: Type.string({require: false}),
                storageName: Type.string({require: false}),
            })
        })
        
      }),
})

export const AnimeModel = typedModel('anime', animeSchema);
export type AnimeDoc = ExtractDoc<typeof animeSchema>;

   {
    "title": "Dragon Ball2",
    "description": "ez egy jo anime",
    "imageLink": "https://blog.gfuel.com/hs-fs/hubfs/G%20FUEL%20Blog/yamcha%20iphone%20battery%20dragon%20ball%20z%20meme.jpg?width=512&name=yamcha%20iphone%20battery%20dragon%20ball%20z%20meme.jpg",
    "series": [
        {
        "title": "Dragon ball Super", 
        "episods": [
            {
                "title": "episode 1",
                "links": [
                    {
                    "link": "episode 1 lik 1",
                    "quality":  "1080p",
                    "storageName": "indavideo"
                    }
                ]
             }
        ]
        },
        {
        "title": "Dragon ball Super Ultra MEGA", 
        "episods": [{
            "title": "episode 1",
            "links": [{
                "link": "episode ASD 1 lik 1",
                "quality":  "480p",
                "storageName": "indavideo SZAR"
                }]
            }]
        }
    ]
}

*/