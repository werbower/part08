import { useQuery } from "@apollo/client/react"
import { queryAllBooks } from "../../services/apollo.service"
import type { AuthorData } from "../authors/authors.component"
import { useState } from "react"

export type BookData = { id: string, title: string, author: AuthorData, published: number, genres: string[] }


const Books = () => {
    const allBooksResult = useQuery(queryAllBooks)
    const [genre, setGenre] = useState<string>('')

    const handleGenreSelect = (item: string) => {
        const newGenre = item === genre ? '' : item
        setGenre(newGenre)
    }
    
    if (allBooksResult.loading)
        return (<div>...loading</div>)
    
    const filters: Array<(x: BookData) => boolean> = [() => true]
    if (genre) {
        filters.push((x) => (x.genres || []).includes(genre))
    }

    const books = ((allBooksResult.data?.allBooks || []) as any as BookData[])
    .filter(b=> filters.every(f=> !!f(b)))
    
    const allGenres = Array.from(new Set(books.flatMap(x => x.genres || [])))

    return (
        <div>
            <h2>books</h2>
            {!!genre && <div>in genre {genre}</div>}

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

            <div className="buttons">
                {allGenres.map(item => (
                    <button key={item} onClick={() => handleGenreSelect(item)}>{item}</button>
                ))}
            </div>
        </div>
    )
}

export default Books
