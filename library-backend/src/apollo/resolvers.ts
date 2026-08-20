
import * as mongoService from '../mongo/mongo.service.js'
import { IAuthor, IBook, IUser } from '../mongo/models.js'

import mongoose from 'mongoose'
import { GraphQLError } from 'graphql'
import { AppoloContext } from './apollo.service.js'




type BookCreate = Omit<IBook, 'id' | '_id' | '_v'>

const checkAuth = (context: AppoloContext) => {
    if (!context.currentUser)
        throw new GraphQLError('not authenticated', {
            extensions: { code: 'not authenticated' }
        })
    return context.currentUser
}

const resolversBase = {
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
        },
        me: async (root: any, args: any, context: AppoloContext) => {
            return context.currentUser
        }
    },

    Mutation: {
        addBook: async (root: any, args: BookCreate, context: AppoloContext) => {
            checkAuth(context)

            const newBook = await mongoService.createBook(args)
            return newBook.toJSON() as IBook
        },
        editAuthor: async (root: any, args: { name: string, setBornTo: number }, context: AppoloContext) => {
            checkAuth(context)

            const result = await mongoService.editAuthor(args)
            return result?.toJSON ? result.toJSON() : result

        },
        createUser: async (root: any, args: Omit<IUser, 'id' | '_id' | '_v'>) => {
            const newUser = await mongoService.createUser(args)
            return newUser.toJSON()
        },

        login: async (root: any, { username, password }: { username: string, password: string }) => {
            const token = await mongoService.login({ username, password })
            if (!token)
                throw new GraphQLError(`invalid username ${username} or password ${password}`, {
                    extensions: { code: 'invalid username or password' }
                })
            return token
        },
        _resetDatabase: async () => {
            if (process.env.NODE_ENV !== 'test') {
                throw new GraphQLError('_resetDatabase is only available in test mode')
            }

            return await mongoService._resetDatabase()
        }
    }
}

//error handler over the base resolver
export const resolvers = Object.fromEntries(Object.entries(resolversBase).map(([key, val]) => {
    return [key, Object.fromEntries(Object.entries(val).map(([k, v]) => [k, (...args: any) => errorHandler(v)(...args)]))]
})) as any as typeof resolversBase




const errorHandler = (fn: (...x: any) => any) => {
    return async (...args: any) => {
        try {
            return await fn(...args)
        } catch (err) {

            if (err instanceof mongoose.Error.ValidationError) {
                const messages = Object.entries(err.errors)
                    .map(([k, v]) => {
                        return v.message || 'validation error'
                    })
                throw new GraphQLError(messages.join('; '), {
                    extensions: { code: 'validation error' }
                })
            }

            if (err instanceof mongoose.mongo.MongoServerError && err.code == 11000) {
                throw new GraphQLError(err.message || 'not uniquie value', {
                    extensions: { code: 'not unique value' }
                })
            }

            throw err
        }

    }


}