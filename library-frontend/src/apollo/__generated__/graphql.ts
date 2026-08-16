/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type AllAuthorsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AllAuthorsQueryQuery = { allAuthors: Array<{ __typename: 'Author', id: string | null, name: string | null, born: number | null, bookCount: number | null } | null> | null };

export type AllBooksQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type AllBooksQueryQuery = { allBooks: Array<{ __typename: 'Book', title: string | null, published: string | null, author: string | null, id: string | null, genres: Array<string | null> | null } | null> | null };
