import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiBookmark, FiChevronLeft, FiPlay, FiStar } from 'react-icons/fi'

const API = 'https://us-central1-summaristt.cloudfunctions.net/getBook'

const fallbackBook = {
  id: 'atomic-habits',
  title: 'Atomic Habits',
  author: 'James Clear',
  subTitle: 'An easy and proven way to build good habits and break bad ones.',
  imageLink: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  averageRating: 4.8,
  totalRating: 10542,
  keyIdeas: 'Small changes can create remarkable results.',
  summary: 'Atomic Habits reveals practical strategies that teach you how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
  tags: ['Self-help', 'Productivity'],
  type: 'audio & text',
  subscriptionRequired: false,
  bookDescription: 'A proven framework for improving every day.',
  authorDescription: 'James Clear is an author and speaker focused on habits and continuous improvement.',
}

function Book() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const loadBook = async () => {
      try {
        const response = await fetch(`${API}?id=${id}`)
        if (!response.ok) throw new Error('Unable to load book')
        setBook(await response.json())
      } catch {
        setBook({ ...fallbackBook, id })
      }
    }

    loadBook()
  }, [id])

  if (!book) {
    return <main className="content"><p className="kicker">LOADING BOOK</p><h1>Preparing your summary...</h1></main>
  }

  const handleRead = () => {
    if (book.subscriptionRequired) {
      navigate('/choose-plan')
      return
    }

    navigate(`/player/${book.id}`)
  }

  return (
    <main className="content book-page">
      <Link className="back-link" to="/for-you">
        <FiChevronLeft /> Back to For you
      </Link>

      <section className="book-detail">
        <div className="detail-cover">
          <img src={book.imageLink} alt={book.title} />
        </div>

        <div className="detail-copy">
          <div className="tag-row">
            {book.tags?.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <h1>{book.title}</h1>
          <h2>{book.author}</h2>
          <p className="detail-subtitle">{book.subTitle}</p>

          <div className="rating">
            <FiStar />
            <strong>{book.averageRating}</strong>
            <span>{book.totalRating?.toLocaleString()} ratings</span>
          </div>

          <div className="detail-actions">
            <button className="dark-button" onClick={handleRead}>
              <FiPlay /> Listen now
            </button>
            <button
              className={saved ? 'save-button saved' : 'save-button'}
              onClick={() => setSaved((current) => !current)}
            >
              <FiBookmark /> {saved ? 'Saved to library' : 'Add to library'}
            </button>
          </div>
        </div>
      </section>

      <div className="book-info-grid">
        <article>
          <p className="kicker">KEY IDEAS</p>
          <h2>{book.keyIdeas}</h2>
          <p className="summary">{book.summary}</p>
          <p className="summary">{book.bookDescription}</p>
        </article>

        <aside>
          <p className="kicker">ABOUT THE AUTHOR</p>
          <p>{book.authorDescription}</p>
          <div className="book-meta">
            <span>Format<strong>{book.type}</strong></span>
            <span>Length<strong>15 min</strong></span>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Book
