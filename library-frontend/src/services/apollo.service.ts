import { gql, InMemoryCache, type TypedDocumentNode } from "@apollo/client";

import { ApolloClient, HttpLink } from "@apollo/client"
import type { BookAddedSubscription, MulLoginMutation, MulLoginMutationVariables, MutAddBookMutation, MutAddBookMutationVariables, MutCreateUserMutation, MutCreateUserMutationVariables, MutEditAuthrorMutation, MutEditAuthrorMutationVariables, QueryAllAuthorsQuery, QueryAllBooksQuery, QueryMeQuery } from "../apollo/__generated__/graphql";

import { useAppStore } from "./app.service";
import { ApolloLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";


const httpLink = new HttpLink({
    uri: 'http://localhost:4000'
})

const wsLink = new GraphQLWsLink(
    createClient({
        url: `ws://localhost:4000`
    })
)

const authMiddleware = new ApolloLink((operation, forward) => {
    const token = useAppStore.getState().token
    operation.setContext({
        headers: {
            authorization: token ? `Bearer ${token}` : "",
        },
    })
    return forward(operation)
})

const splitLink = ApolloLink.split(({ query }) => {
    const definition = getMainDefinition(query)
    return (definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription')
},
    wsLink, authMiddleware.concat(httpLink)

)

export const clientApollo = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
})

export const subsBookAdded: TypedDocumentNode<BookAddedSubscription> = gql`
    subscription bookAdded {
        bookAdded {
            title
            published
            author {
                id
                name
            }
            id
            genres
        }
    }
`


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
    query queryAllBooks($genre: String) {
        allBooks(genre: $genre) {
            title
            published
            author {
                id
                name
            }
            id
            genres
        }
    }
`

export const queryMe: TypedDocumentNode<QueryMeQuery> = gql`
    query queryMe {
        me {
            username
            favoriteGenre
            id
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
            author{
                id
                name
            }
            id
            genres
        }
    }
`

export const mulLogin: TypedDocumentNode<MulLoginMutation, MulLoginMutationVariables> = gql`
    mutation mulLogin($username: String!, $password: String!) {
        login(username: $username, password: $password){
            value
        }
    }
`

export const mutCreateUser: TypedDocumentNode<MutCreateUserMutation, MutCreateUserMutationVariables> = gql`
    mutation mutCreateUser($username: String!, $favoriteGenre: String!) {
        createUser(username: $username, favoriteGenre: $favoriteGenre) {
            id
            username
            favoriteGenre
        }
    }
`


