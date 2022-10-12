import { config } from "dotenv"
import Redis from "ioredis"
config()

const myRedis = new Redis(String(process.env.REDIS_URL))

export default myRedis
