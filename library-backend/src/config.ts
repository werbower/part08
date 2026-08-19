import 'dotenv/config'


export const mongoUrl = process.env.MONGO_URL as string
export const port = process.env.PORT