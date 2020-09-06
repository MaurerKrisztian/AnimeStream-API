import {
    Controller,
    Get,
    Param,
    Req,
    Post,
    BodyParam,
    Delete,
    Put,
    Body,
    Res,
    Authorized,
    CurrentUser,
    Patch
} from "routing-controllers";
import {
    Request,
    Response,
} from "express";
import {
    BcryptAndDecrypt
} from "../model/BcryptAndDecrypt";

import {
    User
} from "../model/User";

import {UserModel} from '../db/models/user';
import {ProfileModel} from "../db/models/profile";
import {DIprovider} from "../DI/DIprovider";


@Controller()
export class UserApiController {
  
    constructor() {}

    @Get('/api/user')
    //@Authorized("user")
    async findUsers(@Req() req: Request, @Res() res: Response) {
        const result = await UserModel.find(req.query)

        //404
        if (result[0] == undefined) {
            res.status(404);
            return {
                message: "Not found"
            }
        }

        return JSON.parse(JSON.stringify(result))
    }

   /* @Get("/api/profile/:profileId/users")
    @Authorized("user")
    async getProfileUsers(@Param("profileId") profileId: string,
        @Res() res: Response) {
        const result = await UserModel.find({
            profileId: profileId
        });

        if (result[0] == undefined) {
            res.status(404);
            return {
                message: "Not found"
            }
        }

        return JSON.stringify(result)
    }*/

    @Post('/api/user')
    //@Authorized("admin")
    async createUser(@Body({
            validate: true
        }) user: any,
        @Req() req: Request, @Res() res: any) {

            console.log("create new user")

        const userTest = null ;//= await UserModel.findOne({email: user.email})

        if(userTest != null){
            res.status(400);
            return {
                message: "User email is not free."
            }
        }

        const hashPassword = await BcryptAndDecrypt.bcryptPassword(user.password);

        console.log("upload", user, hashPassword)
        const newUser = new UserModel({
            email: user.email,
            password: hashPassword,
            name: user.name,
            profileId: user.profileId
        });

      

        const savedUser = await newUser.save()
            .then((data: any) => {
                console.log("USER SAVED")
            })
            .catch((err: any) => {
                return err;
            });

        return {
            message: "user saved."
        };
    }

    @Delete("/api/user/:id")
    //@Authorized("admin")
    async deleteById(@Param("id") id: string, @Res() res: Response) {

        const result = await UserModel.remove({
                _id: id
            }).then((data: any) => {})
            .catch((err: any) => {
                res.status(400);
                return err;
            });

        return {
            message: "deleted user."
        }
    }

    @Patch("/api/user/:id")
    //@Authorized("admin")
    async update(@Body() body: any, @Param("id") id: string, @Res() res: Response) {

        if (body.password != undefined) {
            body.password = await BcryptAndDecrypt.bcryptPassword(body.password);
        }

        const result = await UserModel.update({
                _id: id
            }, {
                $set: body
            })
            .then((data: any) => {
                return "user updated"
            })
            .catch((err: any) => {
                console.log(err)
                res.status(404);
                return err;
            });

        return "";
    }

    @Get("/api/current-user")
    //@Authorized("user")
    currentUser(@CurrentUser({
        required: true
    }) user: User) {
        return JSON.stringify(user);
    }


}