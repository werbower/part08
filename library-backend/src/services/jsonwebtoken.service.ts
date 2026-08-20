import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const createToken = (user: {id: string, username: string})=> {
    const secret = process.env.JWT_SECRET as string
    return jwt.sign(user, secret)
}

export const decodeToken = (token: string)=> {
    if (!((token||'').toLowerCase()).startsWith('bearer ')) return null
    const secret = process.env.JWT_SECRET as string

    const decoded = jwt.verify(token.substring(7), secret) as {id: string, username: string}
    if (!decoded?.id || !decoded?.username) return null
    return decoded
}