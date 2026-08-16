import { gql, InMemoryCache, type TypedDocumentNode } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloClient } from "@apollo/client"
import type { MutAddBookMutation, MutAddBookMutationVariables, MutEditAuthrorMutation, MutEditAuthrorMutationVariables, QueryAllAuthorsQuery, QueryAllBooksQuery } from "../apollo/__generated__/graphql";



export const clientApollo = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000'
    }),
    cache: new InMemoryCache()
})

export const queryAllAuthors: TypedDocumentNode<QueryAllAuthorsQuery> = gql`
    query queryAllAuthors {
        allAuthors {
            id
            name
            born
            bookCount
        }
    }
`

export const queryAllBooks: TypedDocumentNode<QueryAllBooksQuery> = gql`
    query queryAllBooks {
        allBooks {
            title
            published
            author
            id
            genres
        }
    }
`

export const mutEditAuthor: TypedDocumentNode<MutEditAuthrorMutation, MutEditAuthrorMutationVariables> = gql`
    mutation mutEditAuthror($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            id
            name
            born
            bookCount
        }
    }
`

export const mutAddBook: TypedDocumentNode<MutAddBookMutation, MutAddBookMutationVariables> = gql`
    mutation mutAddBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
        addBook(title: $title, author: $author, published: $published, genres: $genres) {
            title
            published
            author
            id
            genres
        }
    }
`