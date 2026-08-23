import { useQuery } from "@apollo/client/react"
import { queryAllBooks, queryMe } from "../../services/apollo.service"
import type { BookData } from "../books/books.component"




export const BooksRecommend = () => {
    const allBooksResult = useQuery(queryAllBooks)
    const meResult = useQuery(queryMe)
    if (allBooksResult.loading || meResult.loading)
        return (<div>...loading</div>)

    const me = meResult.data?.me




    const books = ((allBooksResult.data?.allBooks || []) as any as BookData[])
        .filter(b => b.genres.includes(me?.favoriteGenre as string))

    return (
        <div>
            <h2>recommendations</h2>
            <div>books in your favorite genre {me?.favoriteGenre}</div>

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


