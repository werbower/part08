/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type QueryAllAuthorsQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllAuthorsQuery = { allAuthors: Array<{ __typename: 'Author', id: string, name: string, born: number | null, bookCount: number | null } | null> | null };

export type QueryAllBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllBooksQuery = { allBooks: Array<{ __typename: 'Book', title: string, published: number, id: string, genres: Array<string>, author: { __typename: 'Author', id: string, name: string } } | null> | null };

export type MutEditAuthrorMutationVariables = Exact<{
  name: string;
  setBornTo: number;
}>;


export type MutEditAuthrorMutation = { editAuthor: { __typename: 'Author', id: string, name: string, born: number | null, bookCount: number | null } | null };

export type MutAddBookMutationVariables = Exact<{
  title: string;
  author: string;
  published: number;
  genres: Array<string> | string;
}>;


export type MutAddBookMutation = { addBook: { __typename: 'Book', title: string, published: number, id: string, genres: Array<string>, author: { __typename: 'Author', id: string, name: string } } | null };

export type MulLoginMutationVariables = Exact<{
  username: string;
  password: string;
}>;


export type MulLoginMutation = { login: { __typename: 'Token', value: string } | null };

export type MutCreateUserMutationVariables = Exact<{
  username: string;
  favoriteGenre: string;
}>;


export type MutCreateUserMutation = { createUser: { __typename: 'User', id: string, username: string, favoriteGenre: string } | null };
