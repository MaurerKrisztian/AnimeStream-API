
import {
  IsString,
  Length,
  IsEmail
} from 'class-validator';

export interface User {
  email: string;
  name: string;
  password: string;
  profileId: string;
}