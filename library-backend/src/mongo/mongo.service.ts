import mongoose from "mongoose"
import { mongoUrl } from "../config.js"
import { Author, Book, IAuthor, IBook } from "./models.js"



export const connectDB = async () => {
    return mongoose.connect(mongoUrl, { family: 4 })
}

export const createAuthor = async (author: Pick<IAuthor, 'name' | 'born'>) => {
    const authorModel = new Author(author)
    return authorModel.save()
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
        return Book.find().populate('author')

    const match = {}
    if (genre) {
        Object.assign(match, { "genres": genre })
    }
    if (author) {
        Object.assign(match, { "authorDetails.name": author })
    }

    if (!author)
        return Book.find(match).populate('author')



    return Book.aggregate([
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
    return Author.aggregate([
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

const getBookCount = async () => {
    return Book.estimatedDocumentCount()
}

const getAuthorCount = async () => {
    return Author.estimatedDocumentCount()
}

const editAuthor = async (args: { name: string, setBornTo: number }) => {
    const found = await Author.findOne({name: args.name})
    if (!found)
        return

    found.born = args.setBornTo
    return found.save()

}



export const mongoService = {
    createBook, createAuthor, getBooks, getAuthors, getBookCount, getAuthorCount, editAuthor
}