
import {
  IsString,
  Length,
  IsEmail
} from 'class-validator';

export class User {

  @IsString()
  @IsEmail()
  @Length(4, 40)
  email: string;

  @IsString()
  @Length(4, 40)
  name: string;


  @IsString()
  @Length(4, 40)
  password: string;

  profileId: string;
  
  constructor(email: string, password: string, name: string, profileId: string, lastEdit ? : Date) {
    this.profileId = profileId;
    this.email = email;
    this.name = name;
    this.password = password;
  }
}