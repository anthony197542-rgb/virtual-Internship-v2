import { Link } from 'react-router-dom'
import { FiStar } from 'react-icons/fi'

function BookCard({ book }) {
  const handleImageError = (event) => {
    event.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=360&q=80'
  }

  return (
    <Link className="book-card" to={`/book/${book.id}`}>
      <div className="cover-wrap">
        {book.subscriptionRequired && (
          <span className="premium-pill">PREMIUM</span>
        )}

        <img
          src={book.imageLink}
          alt={book.title}
          onError={handleImageError}
        />
      </div>

      <strong>{book.title}</strong>
      <span>{book.author}</span>
      <small>
        <FiStar />
        {book.averageRating || '4.5'}
        <i>·</i>
        {book.type || 'text'}
      </small>
    </Link>
  )
}

export default BookCard
