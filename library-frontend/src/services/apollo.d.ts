import "@apollo/client";
declare module "@apollo/client" {
  interface RefetchEvents {
    booksRefetch: { reason: string } | undefined;
  }
}