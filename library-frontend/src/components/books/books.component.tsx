import { useQuery } from "@apollo/client/react"
import { allBooksQuery } from "../../services/apollo.service"

export type BookData = { id: string, title: string, author: string, published: string }


const Books = () => {
    const allBooksResult = useQuery(allBooksQuery)

    if (allBooksResult.loading)
        return (<div>...loading</div>)
    
    const books = (allBooksResult.data?.allBooks || []) as BookData[]

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
                            <td>{a.author}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Books
