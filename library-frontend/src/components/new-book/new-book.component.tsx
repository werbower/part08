import { useApolloClient, useMutation } from '@apollo/client/react'
import { useState, type CSSProperties, type SubmitEvent } from 'react'
import { mutAddBook } from '../../services/apollo.service'




const NewBook = () => {
  const [title, setTitle] = useState<string>('')
  const [author, setAuthor] = useState<string>('')
  const [published, setPublished] = useState<string>()
  const [genre, setGenre] = useState<string>('')
  const [genres, setGenres] = useState<string[]>([])

  const aClient = useApolloClient()
  const [addBook] = useMutation(mutAddBook)



  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await addBook({ variables: { author, genres, title, published: +(published || 0) } })
      await aClient.clearStore()

      setTitle('')
      setPublished('')
      setAuthor('')
      setGenres([])
      setGenre('')

    } catch (err) {
      console.error('can not create book', err)
    }
    
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  const formStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
  }

  return (
    <div>
      <form onSubmit={submit} style={formStyle}>
        <label>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </label>
        <label>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </label>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
