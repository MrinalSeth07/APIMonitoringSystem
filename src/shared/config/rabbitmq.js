import amqb from "amqb"
import logger from "./logger.js"
import config from "./ index.js"

class RabbitMQConnetion{
    constructor(){
        this.connection = null;
        this.channel = null;
        this.isConnecting = null;
    }
    async connect(){
        if(this.channel){
            return this.channel;
        }
        if(this.isConnecting){
            await new Promise((resolve) => {
                const checkinterval = setTimeout(()=>{
                    if(!this.isConnecting){
                        clearInterval(checkinterval);
                        resolve()
                    } 
                },100)
            })
            return this.channel;
        }
        try{
            this.isConnecting = true;
            logger.info("Connecting to the RabbitMQ" , config.rabbitmq.url);
            this.connection = await amqb.connect(config.rabbitmq.url);
            this.channel = await this.connection.createchannel();
            // Creating key | Queue name
            const dlqname = `${config.rabbitmq.queue}.dlq `
            // Dead letter queue
            await this.channel.assertQueue(dlqname , {
                durable: true,
            })
            // normal queue
            await this.channel.assertQueue(config.rabbitmq.queue,{
                durable: true,
                arguements: {
                    "x-dead-letter-exchange" : "",
                    "x-dead-letter-routing-key" : dlqname,
                }
            })

            logger.info("RabbitMQ connected , queue: " , config.rabbitmq.queue )
            this.connection.on("close" ,()=>{
                logger.warn(`RabbitMQ connection closed`);
                this.connection = null;
                this.channel = null;
            })
            this.isConnecting = false;
            return this.channel;
        }
        catch(error){
            this.isConnecting = false;
            logger.error("failed to connect to the RabbitMQ" , error);
            throw error;
        }
    }

    getChannel(){
        return this.channel;
    }
    getStatus(){
        if(!this.connect || !this.channel()) return "disconnected";
        if(this.connection.closing) return "closing";
        return "connected";
    }
    async close(){
        try{
            if(this.channel){
                await this.channel.close();
                this.channel = null;
            }
            if(this.connection){
                await this.connection.close();
                this.connection = null;
            }
            logger.info("RabbitMQ connection closed");
        }
        catch (error){
            logger.error("Error in closing the RABBITMQ connection", error);
        }
    }
}
export default new RabbitMQConnetion();