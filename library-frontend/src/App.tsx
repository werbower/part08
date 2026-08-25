
import Authors, { type AuthorData } from './components/authors/authors.component'
import Books, { type BookData } from './components/books/books.component'
import NewBook from './components/new-book/new-book.component'
import { setLogin, useAppStore } from './services/app.service'
import { Login } from './components/login/login.component'
import { BooksRecommend } from './components/books-recommend/books-recommend.component'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import { queryAllAuthors, subsBookAdded } from './services/apollo.service'



const App = () => {
  const page = useAppStore(x => x.page)
  const setPage = useAppStore(x => x.setPage)
  const token = useAppStore(x => x.token)
  const client = useApolloClient()

  useSubscription(subsBookAdded, {
    onData: ({ data }) => {
      const addedBook = data.data?.bookAdded as any as BookData

      client.cache.evict({
        id: 'ROOT_QUERY',
        fieldName: 'allBooks',
      })

      client.cache.updateQuery({ query: queryAllAuthors }, (data) => {
        const allAuthors = (data?.allAuthors || []) as any as AuthorData[]
        const addedAuthor = addedBook.author as any as AuthorData

        const found = allAuthors.find(x => x.id === addedAuthor.id)
        if (found) {
          const newData = allAuthors.map(a => {
            if (a.id === addedAuthor.id)
              a = {...a, bookCount: (a.bookCount||0)+1}
            return a
          })

          return { allAuthors: newData } as any
        }

        return {
          allAuthors: [...allAuthors,{...addedAuthor, bookCount: 1}]
        } as any
      })

      window.alert(`added book ${data.data?.bookAdded.title} by ${data.data?.bookAdded.author.name}`)
    }
  })
  
  function handleLogout() {
    setLogin(undefined)
    if (['add', 'recommend'].includes(page))
      setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!!token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {!!token && <button onClick={() => setPage('recommend')}>recommend</button>}
        {!!token && <button onClick={handleLogout}>logout</button>}
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && <NewBook />}
      {page === 'login' && <Login />}
      {page === 'recommend' && <BooksRecommend />}
    </div>
  )
}

export default App