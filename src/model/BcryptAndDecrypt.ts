const bcrypt = require('bcrypt');

export class BcryptAndDecrypt {
    
    static async bcryptPassword(password: string) {
        let saltRounds = 10;
        let salt = await bcrypt.genSaltSync(saltRounds);
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    }

    static async isMatchHashPassword(password: string, hashPassword: string) {
        const match = await bcrypt.compare(password, hashPassword);
        return match;
    }

}