import {Injectable} from "injection-js";
import {IFixture} from "./IFixture";
import {ProfileModel} from "../db/models/profile";
import {UserModel} from "../db/models/user";
import {BcryptAndDecrypt} from "../model/BcryptAndDecrypt";

const config = require('config')

@Injectable()
export class AdminFixture implements IFixture {

    async load() {

        // create admin profile
        const adminUserProfile = config.get('Admin.profile')

        const profile = await ProfileModel.findOne({
            name: adminUserProfile.name
        });

        if (profile != undefined) {
            console.log("Admin profile already exisit.")
            return;
        }

        const newProfile = await new ProfileModel(adminUserProfile);
        newProfile.save();

        if (newProfile == undefined) {
            console.log("new profile is undefined.")
            return;
        }

        console.log("Admin profile is created: name:" + adminUserProfile.name);

        //create admin user
        let adminUserConf = config.get('Admin.user')
        let adminUser = Object.assign({}, adminUserConf);
        adminUser.profileId = newProfile.id

        const result = await UserModel.findOne({email: adminUser.email})

        if (result != undefined) {
            console.log("admin user already exisit.")
            return;
        }

        adminUser.password = await BcryptAndDecrypt.bcryptPassword(adminUser.password);
        const newUser = new UserModel(adminUser);
        const savedUser = await newUser.save();

        console.log("admin user created:  " + newUser.email);
    }
}