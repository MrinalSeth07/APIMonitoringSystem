import AppError from "../../../shared/utils/ApiError.js";
import jwt from "jsonwebtoken"
import config from "../../../shared/config.js";
import logger from "../../../shared/config/logger.js"
export class AuthService{
    constructor(userRepository){
        if(!userRepository){
            throw new Error("User Reposiory is Required");
        }
        this.userRepository = userRepository;
    };

    async generateToken(user){
        const{id , email , username , role , clientId} = user;
        const payload = {
            userId: id,
            username,
            email,
            role,
            clientId,
        }
        return jwt.sign(payload , config.jwt.secret,{
            expiresIn: config.jwt.expiresIn
        })
    }
    async onboardSuperAdmin(superAdminData){
        try{
            const existingUser = this.userRepository.findAll();
            if(existingUser && existingUser.length > 0){
                throw new AppError("SuperAdmin onboarding is disabled",403);
            }
            const user = await this.userRepository.create(superAdminData);
            const token = this.generateToken(user);
            logger.info("Admin onboard Successfully",{
                username: user.username
            })
            return {
                user,
                token
            }
        }
        catch(error)
    }
}