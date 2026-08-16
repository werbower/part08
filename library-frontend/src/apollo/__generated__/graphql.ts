/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type QueryAllAuthorsQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllAuthorsQuery = { allAuthors: Array<{ __typename: 'Author', id: string | null, name: string | null, born: number | null, bookCount: number | null } | null> | null };

export type QueryAllBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAllBooksQuery = { allBooks: Array<{ __typename: 'Book', title: string | null, published: number | null, author: string | null, id: string | null, genres: Array<string | null> | null } | null> | null };

export type MutEditAuthrorMutationVariables = Exact<{
  name: string;
  setBornTo: number;
}>;


export type MutEditAuthrorMutation = { editAuthor: { __typename: 'Author', id: string | null, name: string | null, born: number | null, bookCount: number | null } | null };

export type MutAddBookMutationVariables = Exact<{
  title: string;
  author: string;
  published: number;
  genres: Array<string> | string;
}>;


export type MutAddBookMutation = { addBook: { __typename: 'Book', title: string | null, published: number | null, author: string | null, id: string | null, genres: Array<string | null> | null } | null };
