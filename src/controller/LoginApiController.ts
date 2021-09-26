import {
  Controller,
  BodyParam,
  Post,
  Res
} from "routing-controllers";

import {
  Response
} from "express";

import {
  BcryptAndDecrypt
} from "../model/BcryptAndDecrypt";

import {UserModel} from '../db/models/user';
import {ProfileModel} from "../db/models/profile";
import {DIprovider} from "../DI/DIprovider";
import {MyLogger} from "../services/Logger";
const jwt = require("jsonwebtoken");

@Controller()
export class LoginApiController {

  ACCESS_TOKEN_EXPIRES_TIME: string = "1y";
  REFRESH_TOKEN_EXPIRES_TIME: string = "1h";

  @Post('/api/login')
  async login(@BodyParam('login') login: string, @BodyParam('email') email: string, @BodyParam('password') password: string, @Res() res: Response) {

    if(login!=undefined){email = login}

    if (password == undefined || email == undefined) {
      res.status(400)
      return {
        message: "Missing required parameter."
      }
    }

    const user = await UserModel.findOne({
      email: email
    });

    if (!user || user.password == undefined) {
      res.status(401)
      return {
        message: "Wrong email / password"
      };
    }

    const isPassMatch = await BcryptAndDecrypt.isMatchHashPassword(password, user.password)
    if (!isPassMatch) {
      res.status(401)
      return {
        message: "Wrong email / password"
      };
    }

    const accessToken = await this.signAccessToken(user._id);
    const refreshToken = await this.signRereshToken(user._id);
    if (accessToken == undefined || refreshToken == undefined) {
      res.status(500)
      return {
        message: "Generated token is undefined"
      };
    }


    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      roles: user.roles,
      userId: JSON.parse(JSON.stringify(user))._id,
      /*profileId: user.profileId,*/
    };
  }


  @Post("/api/refresh-token")
  async refreshToken(@BodyParam("refreshToken") refreshToken: string, @Res() res: any) {


    if (!refreshToken) {
      res.status(500)
      return {
        message: "Missing refreshToken."
      };
    } 

    let userId;
    try {
      userId = await this.vereifyRefreshToken(refreshToken)
    } catch (err) {
      MyLogger.error(err);
      return {
        message: "Token is invalid"
      }
    }

    if (userId == undefined) {
      return {
        message: "User not found"
      };
    }

    const newAccessToken = await this.signAccessToken(userId);
    const newRefreshToken: any = await this.signRereshToken(userId);

    if (newAccessToken == undefined || newRefreshToken == undefined) {
      res.status(500)
      return {
        message: "Generated token is undefined"
      };
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  async findUser(userId: string) {
    let user = await UserModel.findOne({
      _id: userId
    });
    if (!user) return undefined

    return user
  }

  async signAccessToken(userId: string) {

    const user = await this.findUser(userId);
    if (user == undefined) return undefined;

    const options = {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_TIME
    }

    //create token
    const token = jwt.sign({
      aud: userId,
      _id: userId,
      email: user.email,
      name: user.name,
      password: user.password
    }, process.env.ACCESS_TOKEN_SECRET, options);

    return token;
  }


  async signRereshToken(userId: string) {
    const user = await this.findUser(userId)
    if (user == undefined) return undefined;

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: this.REFRESH_TOKEN_EXPIRES_TIME
    }

    const refreshToken = jwt.sign({
      aud: user.id,
      _id: user.id,
      email: user.email,
      name: user.name,
      password: user.password
    }, secret, options);

    return refreshToken;
  }

  vereifyRefreshToken(refreshToken: string) {
    const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!token) return undefined

    return token._id;
  }

}