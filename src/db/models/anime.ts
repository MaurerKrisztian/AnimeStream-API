export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const animeSchema = createSchema({
    title:Type.string({require: true}),
    description:Type.string({require: true}),
    imageLink:Type.string({require: true}),
})

export const AnimeModel = typedModel('anime', animeSchema);
export type AnimeDoc = ExtractDoc<typeof animeSchema>;
