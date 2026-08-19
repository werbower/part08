import mongoose from "mongoose"
import { Transform } from "node:stream"

export interface IAuthor {
    _id: string
    _v: number

    id: string
    name: string
    born?: number
    bookCount?: number
}

const authorSchema = new mongoose.Schema<IAuthor>({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 4,
    },
    born: {
        type: Number,
    },
})


authorSchema.set("toJSON", {transform: (_doc, res)=> {
    res.id = res._id = res._id.toString()
}})


export const Author = mongoose.model('Author', authorSchema)

export interface IBook {
    _id: string
    _v: number

    id: string
    title: string
    published: number
    author?: IAuthor|string
    genres: string[]
}

const bookSchema = new mongoose.Schema<IBook>({
    title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  genres: [{ type: String }],
})
bookSchema.set("toJSON", {transform: (_doc, res)=> {
    res.id = res._id = res._id.toString()
}})

export const Book = mongoose.model('Book', bookSchema)
