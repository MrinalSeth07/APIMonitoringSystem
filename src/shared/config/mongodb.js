import mongoose, { mongo } from "mongoose";
import config from "./index";
import logger from "./logger";



/* 
    MongoDB connector implemented in the Singleton design pattern
*/
class MongoConnection{
    constructor(){
        this.connection = null;
    }
    /* 
    Connect to MongoDB
    @return  {Promise <mongoose.connection>}
    */
    async connect(){
        try{
            if(this.connection){
                logger.infor("MongoDb already Connnected");
                return this.connection
            }

            await mongoose.connect(config.mongo.url,{
                dbName: config.mongo.dbName
            })
            this.connection = mongoose.connection;
            logger.info(`MongodB connected : ${config.mongo.uri}`);
            this.connection.on("error", err => {
                logger.error("MongoDB connection error " , err)
            })
            this.connection.on("disconnected", err => {
                logger.error("MongoDB Disconnected " , err)
            })
            return this.connection
        } catch (error){
            logger.error("Failed to connect to MongoDB" , error);
            throw error;
        }
    }
    /* 
    Disconnet to MongoDB
    */
    async disconnect(){
        try{
            if(this.connection){
                await mongoose.disconnect();
                this.connection = null;
                logger.info("MongoDB disconnected")
                
            }
        }
        catch (error){
            logger.error("Failed to disconnect to MongoDB" , error);
            throw error;
        }
    }
    /**
     * Get the active Connection
     */
    getConnection(){
        return this.connection;
    }
}
export default MongoConnection;

