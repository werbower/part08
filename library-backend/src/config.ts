import 'dotenv/config'


const mongoUrl = process.env.MONGODB_URI as string
export const port = process.env.PORT
export const secret = process.env.JWT_SECRET as string