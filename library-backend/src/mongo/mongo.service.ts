import mongoose from "mongoose"
import { mongoUrl } from "../config.js"
import { Author, Book, IAuthor, IBook } from "./models.js"




export const connectDB = async () => {
    return mongoose.connect(mongoUrl, { family: 4 })
}

const createAuthor = async (author: Pick<IAuthor, 'name' | 'born'>) => {
    const authorModel = new Author(author)
    return await authorModel.save()
}

const createBook = async (book: Omit<IBook, '_id' | '_v'>) => {
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

const getBooks = async (author: string, genre: string) => {
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

const getAuthors = async () => {
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

const getBookCount = async () => {
    return await Book.estimatedDocumentCount()
}

const getAuthorCount = async () => {
    return await Author.estimatedDocumentCount()
}

const editAuthor = async (args: { name: string, setBornTo: number }) => {
    const found = await Author.findOne({ name: args.name })
    if (!found)
        return

    found.born = args.setBornTo
    return await found.save()

}





export const mongoService = { createBook, createAuthor, getBooks, getAuthors, getBookCount, getAuthorCount, editAuthor }






