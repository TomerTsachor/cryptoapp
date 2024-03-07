import mongoose from "mongoose";
import config from 'config'

const host = config.get<string>('mongo.host')
const port = config.get<string>('mongo.port')
const database = config.get<string>('mongo.database')

mongoose.connect(`mongodb://${host}:${port}/${database}`)

export default mongoose;