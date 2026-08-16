import { gql, InMemoryCache, type TypedDocumentNode } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { ApolloClient } from "@apollo/client"
import type { AllAuthorsQueryQuery, AllBooksQueryQuery } from "../apollo/__generated__/graphql";



export const clientApollo = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:4000'
    }),
    cache: new InMemoryCache()
})

export const allAuthorsQuery: TypedDocumentNode<AllAuthorsQueryQuery> = gql`
    query allAuthorsQuery {
        allAuthors {
            id
            name
            born
            bookCount
        }
    }
`

export const allBooksQuery: TypedDocumentNode<AllBooksQueryQuery> = gql`
    query allBooksQuery {
        allBooks {
            title
            published
            author
            id
            genres
        }
    }
`