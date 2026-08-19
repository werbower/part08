import { v1 as uuid } from 'uuid'
import { mongoService } from '../mongo/mongo.service.js'
import { IAuthor, IBook } from '../mongo/models.js'
import { it } from 'node:test'

type AuthorData = { name: string, id: string, born?: number }
type BookData = { title: string, published: number, authorId: string, id: string, genres: string[] }

type BookCreate = Omit<BookData, 'id' | 'authorId'> & { author: string }

export const resolvers = {
    Query: {
        bookCount: () => mongoService.getBookCount(),
        authorCount: () => mongoService.getAuthorCount(),

        allBooks: async (root: any, args: { author: string, genre: string }) => {
            const result = await mongoService.getBooks(args.author, args.genre)
            return result.map((item: IBook & { toJSON?: () => IBook }) => {
                if (item.toJSON)
                    return item.toJSON()

                item.id = item._id
                const author = item.author as IAuthor
                author.id = author._id

                return item
            })
        },
        allAuthors: async () => {
            const result = await mongoService.getAuthors()
            return result.map((item: IAuthor) => ({ ...item, id: item._id }))
        }
    },

    Mutation: {
        addBook: async (root: any, args: BookCreate) => {
            const newBook = await mongoService.createBook(args)
            console.log('result ', newBook.toJSON())

            return newBook.toJSON()
        },
        editAuthor: async (root: any, args: { name: string, setBornTo: number }) => {
            const result = await mongoService.editAuthor(args)
            return result?.toJSON ? result.toJSON() : result

        }
    }
}