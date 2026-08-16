import { useQuery } from "@apollo/client/react"
import { allAuthorsQuery } from "../../services/apollo.service"

export type AuthorData = {id: string, name: string, born: number, bookCount: number}

const Authors = () => {
  const allAuthorsResult = useQuery(allAuthorsQuery)

  if(allAuthorsResult.loading)
    return (<div>...loading</div>)
  
  const authors  = (allAuthorsResult.data?.allAuthors || []) as AuthorData[]

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
