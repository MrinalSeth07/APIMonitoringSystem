import pg from "pg"
import config from "./config"
import logger from "./logger"

const { pool } = pg;

class PostgresConnection{
    constructor(){
        this.pool = null
    }
    getPool(){
        if(!this.pool){
            this.pool = new Pool({
                host: config.postgres.host,
                port: config.postgres.port,
                database: config.postgres.database,
                user: config.postgres.user,
                password: config.postgres.password,
                max: 20,
                idleTimeoutMillis : 30000,
                connetionTimeoutMillis : 2000,
            }) 
        }
        this.pool.on("error" , err => {
            logger.error("Unexpected error on idle PG client" , err)
        })
        logger.info("PG pool created")
        return this.pool
    }


    async testpool(){
        try {
            const pool = this.getPool();
            const client = await pool.connect();
            const result = await client.query("SELECT NOW()");
            client.release();
            logger.info(`PG connected sucessfully at ${Date()}`)
            
        }
        catch(error){
            logger.error("Failed to connect to the PG" , error);
            throw(error);
        }
    }
    async query(text , params){ 
        const pool = this.getPool()
        const start = Date.now()
        try{
            const result = await pool.query(text,params)
            const duration = Date.now - start;
            logger.debug(`Executed query` , {text , duration , rows : result.rowCount});
            return result;
        }
        catch(error){
            logger.error(`Qeury error: ` , {text , error : error.message })
            throw error

        }
    }
    async close(){
        if(this.pool){
            await this.pool.end();
            this.pool = null;
            logger.info("PG pool closed")
        }
    }
}

export default new PostgresConnection();
