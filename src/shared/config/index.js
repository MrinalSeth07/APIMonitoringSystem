// yaha pr global level ka config for the reusability

import dotenv from "dotenv"
dotenv.config()

const config = {
    // server
    node_env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || "5000" , 10), // 10 for the decimal conversion to return the decimal

    //MongoDB
    mongo:
    {
        uri: process.env.MONGO_URI,
        dbName: process.env.MONGO_DB_NAME,
    },
    //Postgres
    postgres:
    {
        host: process.env.PG_HOST ,
        port: parseInt(process.env.PORT || "5432" , 10),
        database: process.env.PG_DATABASE,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
    },
    // rabbitmq
    rabbitmq:
    {
        url: process.env.RABBITMQ_URL ,
        queue: process.env.RABBITMQ_QUEUE,
        publishConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS, // keep it true so msg dont get lost 
        retryAttempts: process.env.RABBITMQ_RETRY_ATTEMPTS, // 3
        retryDelay: process.env.RABBITMQ_RETRY_DELAY, // 1000 ms

    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    ratelimit: {
        windowMs: process.env.WINDOW_MS, // 15 mins
        maxRequests: process.env.MAX_REQUESTS, // 1000 req per 15 mins
    }
    
}
export default config;
