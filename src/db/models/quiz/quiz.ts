export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const quizSchema = createSchema({
    title:Type.string({require: true}),
    description:Type.string({require: true}),
    userId:Type.string({require: false}),
    keyWords: Type.array({default: ["quiz"]}).of(Type.string({ required: true })),
    type: Type.string({require: false, default: "quiz"}),
    questions: Type.array().of({
        question:Type.string({require: true}),
        imageLink:Type.string({require: true}),
        answers: Type.array().of({    
            answer:Type.string({require: true}),
            incrementResultId: Type.string({require: true})
        })
    })
})




export const quizModel = typedModel('quiz', quizSchema);
export type quizDoc = ExtractDoc<typeof quizSchema>;
