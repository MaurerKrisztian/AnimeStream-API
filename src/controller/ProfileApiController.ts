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
import {
    Profile
} from "../model/Profile";


import {ProfileModel, ProfileDoc} from "../db/models/profile"

@Controller()
export class ProfileApiController {

    @Post("/api/profile")
    //@Authorized("admin")
    async newProfile(@Body({
        validate: true
    }) profile: ProfileDoc, @Res() res: any) {

        const profileTest = await ProfileModel.findOne({name: profile.name})

        if(profileTest != null){
            res.status(400);
            return {
                message: "Profile name is not free."
            }
        }

        const newProfile = await new ProfileModel({
            profile    
        });
        newProfile.save();

        return {
            message: "Profile saved."
        };
    }

    @Get("/api/profile")
    //@Authorized("user")
    async getProfileById(@Req() req: any, @Res() res: any) {
        const profiles = await ProfileModel.find(req.query);

        //404
        if (profiles[0] == undefined) {
            res.status(404);
            return {
                message: "Profile Not found"
            }
        }

        return JSON.stringify(profiles)
    }

    @Delete("/api/profile/:id")
    //@Authorized("admin")
    async deleteById(@Param("id") id: string, @Res() res: any) {

        const removedProfile = await ProfileModel.remove({
            _id: id
        });

        //404
        if (removedProfile == undefined) {
            res.status(404);
            return {
                message: "Profile Not found"
            }
        }

        return JSON.stringify({
            message: "profile is removed",
            profile: removedProfile
        })
    }

    @Patch("/api/profile/:id")
    //@Authorized("admin")
    async update(@Body() body: any, @Param("id") id: string) {

        const res = await ProfileModel.update({
            _id: id
        }, {
            $set: body
        });

        return JSON.stringify(res);
    }

}