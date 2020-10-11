export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';


const ProfileSchema = createSchema({

    name: Type.string({require: true}),
    allQuiz: Type.number({require: true, default: 0}),
  
})

export const ProfileModel = typedModel('Profile', ProfileSchema);
export type ProfileDoc = ExtractDoc<typeof ProfileSchema>;