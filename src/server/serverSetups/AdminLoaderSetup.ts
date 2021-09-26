import {Injectable} from "injection-js";
import {IServerSetup} from "./IServerSetup";
import {Express} from "express";
import {ProfileModel} from "../../db/models/profile";
import {MyLogger} from "../../services/Logger";
import {UserModel} from "../../db/models/user";
import {BcryptAndDecrypt} from "../../model/BcryptAndDecrypt";

const config = require('config')

@Injectable()
export class AdminLoaderSetup implements IServerSetup {

    async setup(app: Express) {
        // create admin profile
        const adminUserProfile = config.get('Admin.profile')

        const profile = await ProfileModel.findOne({
            name: adminUserProfile.name
        });

        if (profile != undefined) {
            MyLogger.info("Admin profile already exisit.")
            return;
        }

        const newProfile = await new ProfileModel(adminUserProfile);
        newProfile.save();

        if (newProfile == undefined) {
            MyLogger.error("new profile is undefined.")
            return;
        }

        MyLogger.info("Admin profile is created: name:" + adminUserProfile.name);

        //create admin user
        let adminUserConf = config.get('Admin.user')
        let adminUser = Object.assign({}, adminUserConf);
        adminUser.profileId = newProfile.id

        const result = await UserModel.findOne({email: adminUser.email})

        if (result != undefined) {
            MyLogger.warn("admin user already exisit.")
            return;
        }

        adminUser.password = await BcryptAndDecrypt.bcryptPassword(adminUser.password);
        const newUser = new UserModel(adminUser);
        const savedUser = await newUser.save();

        MyLogger.info("admin user created:  " + newUser.email);
    }
}