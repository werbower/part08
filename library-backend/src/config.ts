import 'dotenv/config'


export const mongoUrl = process.env.MONGO_URL as string
export const port = process.env.PORT
export const secret = process.env.JWT_SECRET as string