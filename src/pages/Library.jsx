import { Link } from 'react-router-dom'
import { FiBookmark, FiChevronRight } from 'react-icons/fi'
import BookCard from '../components/BookCard'

function Library({ books, finishedBooks = [] }) {
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

      <section className="shelf">
        <div className="shelf-title">
          <h2>Finished books</h2>
        </div>
        {finishedBooks.length > 0 ? (
          <div className="library-grid">
            {finishedBooks.map((book) => (
              <BookCard book={book} key={book.id} />
            ))}
          </div>
        ) : (
          <p className="empty-copy">Books you finish listening to will appear here.</p>
        )}
      </section>
    </main>
  )
}

export default Library
