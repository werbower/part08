import mongoose from "mongoose"
import 'dotenv/config'
import { Author, Book, IAuthor, IBook, IUser, User } from "./models.js"
import { createToken, decodeToken } from "../services/jsonwebtoken.service.js"




export const connectDB = async () => {
    const mongoUrl = process.env.MONGODB_URI as string
    return mongoose.connect(mongoUrl, { family: 4 })
}

export const createAuthor = async (author: Pick<IAuthor, 'name' | 'born'>) => {
    const authorModel = new Author(author)
    return await authorModel.save()
}

export const createBook = async (book: Omit<IBook, '_id' | '_v'>) => {
    const foundAuthor = await Author.findOne({ name: book.author as string })
    let authorId = foundAuthor?._id.toString()

    if (!authorId) {
        const authorModel = await createAuthor({ name: book.author as string })
        authorId = authorModel._id.toString()
    }

    const newBook = new Book({ ...book, author: authorId })
    await newBook.save()
    await newBook.populate('author')
    return newBook
}

export const getBooks = async (author: string, genre: string) => {
    if (!author && !genre)
        return await Book.find().populate('author')

    const match = {}
    if (genre) {
        Object.assign(match, { "genres": genre })
    }
    if (author) {
        Object.assign(match, { "authorDetails.name": author })
    }

    if (!author)
        return await Book.find(match).populate('author')



    return await Book.aggregate([
        {
            $lookup: {
                from: 'authors',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDetails'
            }
        },
        { $match: match },
        { $set: { author: { $first: '$authorDetails' } } }
    ])
}

export const getAuthors = async () => {
    return await Author.aggregate([
        {
            $lookup: {
                from: 'books',
                localField: '_id',
                foreignField: 'author',
                as: 'bookCount'
            }
        },
        { $set: { bookCount: { $size: '$bookCount' } } }
    ])
}

export const getBookCount = async () => {
    return await Book.estimatedDocumentCount()
}

export const getAuthorCount = async () => {
    return await Author.estimatedDocumentCount()
}

export const editAuthor = async (args: { name: string, setBornTo: number }) => {
    const found = await Author.findOne({ name: args.name })
    if (!found)
        return

    found.born = args.setBornTo
    return await found.save()

}

export const createUser = async (args: IUser) => {
    const newUser = new User(args)
    return await newUser.save()
}

export const getUsers = async () => {
    return await User.find()
}

export const login = async (args: { username: string, password: string }) => {
    if(args.password !== 'secret')
        return null

    const foundUser = await User.findOne({ username: args.username })
    if (!foundUser) return null

    const token = createToken({ id: foundUser.id, username: foundUser.username })
    return { value: token }
}

export const getUserFromAuthHeader = async (token: string): Promise<IUser|null> => {
    const decoded = decodeToken(token)
    if (!decoded) return null

    const foundUser = await User.findById(decoded.id)
    if (!foundUser) return null
    
    return foundUser.toJSON()
}

export const _resetDatabase = async()=> {     
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
}








