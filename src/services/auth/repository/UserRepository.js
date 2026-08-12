import BaseRepository from "./BaseRepository.js";
import User from "../../../shared/models/User.js"
import logger from "../../../shared/config/logger.js";
class MongoUserRepository extends BaseRepository{
    constructor(){
        super(User)
    }
    async create(userData){
        try{
            let data = {...userData};
            if(data.role ===  "super_admin" && !data.permissions){
                data.permissions = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true,
                }
            }
            const user = new this.model(data);
            await user.save();
            logger.info("User created" , {username : user.username});
            return user;
        }
        catch(error){
            logger.error("Error creating User" , {username : user.username});
            throw error;
        }
    }
    async findbyId(id){
        try{
            const user = this.model.findbyId(id);
            return user;
        }
        catch(error){
            logger.error("Error user find by id" , error);
            throw error;
        }
    }
    async findbyUsername(username){
         try{
            const user = await this.model.findOne({username});
            return user;
        }
        catch(error){
            logger.error("Error user find by username" , error);
            throw error;
        }
    }
    async findbyEmail(email){
        try{
            const user = await this.model.findOne({email});
            return user;
        }
        catch(error){
            logger.error("Error user find by email" , error);
            throw error;
        }
    }
    async findAll(){
        try{
            const users = await this.model.find({ isActive: true })
            .select("-password");
            return user;
        }
        catch(error){
            logger.error("Error user finding all at once" , error);
            throw error;
        }
    }
}