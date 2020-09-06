export {};

import {createSchema, ExtractDoc, Type, typedModel} from 'ts-mongoose';

const userSchema = createSchema({
    email:Type.string({require: true}),
    password:Type.string({require: true}),
    name:Type.string({require: true}),
    roles: Type.array({default: ["user"]}).of(Type.string({ required: true }))
})

export const UserModel = typedModel('user', userSchema);
export type UserDoc = ExtractDoc<typeof userSchema>;
