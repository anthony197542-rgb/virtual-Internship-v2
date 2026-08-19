import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BookCard from '../components/BookCard'

const API = 'https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle'

function Search() {
  const location = useLocation()
  const query = new URLSearchParams(location.search).get('q') || ''
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true

    const searchBooks = async () => {
      if (!query.trim()) {
        setBooks([])
        return
      }

      setLoading(true)

      try {
        const response = await fetch(`${API}?search=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Unable to search books')

        const data = await response.json()
        if (active) setBooks(Array.isArray(data) ? data : [])
      } catch {
        if (active) setBooks([])
      } finally {
        if (active) setLoading(false)
      }
    }

    searchBooks()

    return () => {
      active = false
    }
  }, [query])

  return (
    <main className="content">
      <div className="content-heading">
        <p className="kicker">SEARCH RESULTS</p>
        <h1>{query ? `Results for “${query}”` : 'Search the library'}</h1>
        <p>Find books by title or author.</p>
      </div>

      {loading && <p className="empty-copy">Searching the library...</p>}

      {!loading && books.length > 0 && (
        <div className="library-grid">
          {books.map((book) => <BookCard book={book} key={book.id} />)}
        </div>
      )}

      {!loading && books.length === 0 && (
        <div className="empty-state">
          <h2>{query ? 'No books found' : 'Start searching'}</h2>
          <p>
            {query
              ? 'Try another title or author.'
              : 'Use the search bar above to find your next idea.'}
          </p>
        </div>
      )}
    </main>
  )
}

export default Search
