export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const quizResultSchema = createSchema({
    quizId: Type.string({require: true}),  
    title: Type.string({require: true}),
    description:Type.string({require: true}),
    imageLinkUrl:Type.string({require: false})
})

export const quizResultModel = typedModel('quizResultquiz', quizResultSchema);
export type quizResultDoc = ExtractDoc<typeof quizResultSchema>;
