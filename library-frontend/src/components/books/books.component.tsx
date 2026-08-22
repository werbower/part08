import { useQuery } from "@apollo/client/react"
import {  queryAllBooks } from "../../services/apollo.service"
import type { AuthorData } from "../authors/authors.component"

export type BookData = { id: string, title: string, author: AuthorData, published: number }


const Books = () => {
    const allBooksResult = useQuery(queryAllBooks)

    if (allBooksResult.loading)
        return (<div>...loading</div>)
    
    const books = (allBooksResult.data?.allBooks || []) as any as BookData[]

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map((a) => (
                        <tr key={a.id}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Books
