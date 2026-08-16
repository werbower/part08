import { useState } from 'react'
import Authors from './components/authors/authors.component'
import Books from './components/books/books.component'
import NewBook from './components/new-book/new-book.component'

const App = () => {
  const [page, setPage] = useState('authors')
  

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      {page === 'authors' && <Authors />}

      {page === 'books' && <Books />}

      {page === 'add' && <NewBook />}
    </div>
  )
}

export default App