import {
    IsString,
    Length,
    IsArray,
    IsNumber
} from "class-validator";
export class Profile {

    @IsString()
    @Length(3, 50)
    name: string;
  
    @IsNumber()
    allQuiz: number;
  


    constructor(name: string, allQuiz: number) {
        this.name = name;
        this.allQuiz = allQuiz;
    }

}