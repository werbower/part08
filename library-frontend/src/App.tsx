
import Authors from './components/authors/authors.component'
import Books from './components/books/books.component'
import NewBook from './components/new-book/new-book.component'
import { useAppStore } from './services/app.service'
import { Login } from './components/login/login.component'



const App = () => {
  
  const page = useAppStore(x=> x.page)
  const setPage = useAppStore(x=> x.setPage)
  const token = useAppStore(x => x.token)

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!!token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {!!token && <button onClick={() => setPage('logout')}>logout</button>}
      </div>

      {page === 'authors' && <Authors />}
      {page === 'books' && <Books />}
      {page === 'add' && <NewBook />}
      {page === 'login' && <Login />}
    </div>
  )
}

export default App