import { Link } from 'react-router-dom'
import { FiBookmark, FiChevronRight } from 'react-icons/fi'
import BookCard from '../components/BookCard'

function Library({ books }) {
  const savedBooks = books || []

  return (
    <main className="content">
      <div className="content-heading">
        <p className="kicker">YOUR COLLECTION</p>
        <h1>My library</h1>
        <p>Your saved books, ready when you are.</p>
      </div>

      {savedBooks.length > 0 ? (
        <div className="library-grid">
          {savedBooks.map((book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiBookmark />
          <h2>Your library is waiting</h2>
          <p>Save a book from your recommendations and it will show up here.</p>
          <Link className="dark-button" to="/for-you">
            Explore books <FiChevronRight />
          </Link>
        </div>
      )}
    </main>
  )
}

export default Library
