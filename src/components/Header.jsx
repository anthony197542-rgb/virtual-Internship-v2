import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSearch, FiUser, FiX } from 'react-icons/fi'

const API =
  'https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle'

function Header({ user }) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim().length < 2) {
        setResults([])
        return
      }

      try {
        const response = await fetch(
          `${API}?search=${encodeURIComponent(search)}`,
        )

        const data = await response.json()
        setResults(Array.isArray(data) ? data.slice(0, 5) : [])
      } catch {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const handleSearch = (event) => {
    if (event.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`)
      setResults([])
    }
  }

  return (
    <header className="app-header">
      <div className="mobile-logo">
        <Link className="logo" to="/">
          <span>✦</span> summarist
        </Link>
      </div>

      <div className="search-wrap">
        <FiSearch />

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search by title or author"
          aria-label="Search books"
        />

        {search && (
          <button type="button" onClick={() => setSearch('')}>
            <FiX />
          </button>
        )}

        {results.length > 0 && (
          <div className="search-results">
            {results.map((book) => (
              <Link
                to={`/book/${book.id}`}
                key={book.id}
                onClick={() => setSearch('')}
              >
                <img src={book.imageLink} alt="" />
                <span>
                  <strong>{book.title}</strong>
                  <small>{book.author}</small>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="header-user">
        <span>{user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}</span>
        <div className="header-avatar">
          <FiUser />
        </div>
      </div>
    </header>
  )
}

export default Header