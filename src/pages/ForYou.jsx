import { useEffect, useState } from 'react'
import BookCard from '../components/BookCard'

const API = 'https://us-central1-summaristt.cloudfunctions.net/getBooks'

const fallbackBooks = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    subTitle: 'An easy and proven way to build good habits.',
    imageLink: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    averageRating: 4.8,
    type: 'audio & text',
    subscriptionRequired: false,
    status: 'selected',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    subTitle: 'Rules for focused success in a distracted world.',
    imageLink: 'https://covers.openlibrary.org/b/id/8231852-L.jpg',
    averageRating: 4.6,
    type: 'text',
    subscriptionRequired: false,
    status: 'recommended',
  },
  {
    id: 'psychology-of-money',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    subTitle: 'Timeless lessons on wealth, greed, and happiness.',
    imageLink: 'https://covers.openlibrary.org/b/id/10909258-L.jpg',
    averageRating: 4.7,
    type: 'audio & text',
    subscriptionRequired: true,
    status: 'recommended',
  },
  {
    id: 'show-your-work',
    title: 'Show Your Work!',
    author: 'Austin Kleon',
    subTitle: '10 ways to share your creativity and get discovered.',
    imageLink: 'https://covers.openlibrary.org/b/id/8235099-L.jpg',
    averageRating: 4.5,
    type: 'text',
    subscriptionRequired: false,
    status: 'suggested',
  },
]

function getFallbackBooks(status) {
  return fallbackBooks.filter((book) => book.status === status)
}

async function loadBooks(status) {
  try {
    const response = await fetch(`${API}?status=${status}`)

    if (!response.ok) {
      throw new Error('Unable to load books')
    }

    const data = await response.json()
    return Array.isArray(data) ? data : [data]
  } catch {
    return getFallbackBooks(status)
  }
}

function BookSkeleton() {
  return (
    <div className="book-skeleton" aria-label="Loading book">
      <div />
      <span />
      <span />
    </div>
  )
}

function ForYou() {
  const [selectedBook, setSelectedBook] = useState(null)
  const [recommendedBooks, setRecommendedBooks] = useState([])
  const [suggestedBooks, setSuggestedBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllBooks = async () => {
      const [selected, recommended, suggested] = await Promise.all([
        loadBooks('selected'),
        loadBooks('recommended'),
        loadBooks('suggested'),
      ])

      setSelectedBook(selected[0] || null)
      setRecommendedBooks(recommended)
      setSuggestedBooks(suggested)
      setLoading(false)
    }

    loadAllBooks()
  }, [])

  return (
    <main className="content">
      <header className="content-heading">
        <p className="kicker">YOUR DAILY BRIEFCAST</p>
        <h1>Welcome to your library</h1>
        <p>Pick a book and find your next idea.</p>
      </header>

      {loading ? (
        <section className="selected-book">
          <BookSkeleton />
        </section>
      ) : selectedBook ? (
        <section className="selected-book">
          <img src={selectedBook.imageLink} alt={selectedBook.title} />
          <div>
            <span className="pill">SELECTED FOR YOU</span>
            <h2>{selectedBook.title}</h2>
            <h3>{selectedBook.author}</h3>
            <p>{selectedBook.subTitle}</p>
          </div>
        </section>
      ) : null}

      <BookShelf title="Recommended for you" books={recommendedBooks} loading={loading} />
      <BookShelf title="Suggested books" books={suggestedBooks} loading={loading} />
    </main>
  )
}

function BookShelf({ title, books, loading }) {
  return (
    <section className="shelf">
      <div className="shelf-title">
        <h2>{title}</h2>
      </div>

      <div className="book-row">
        {loading
          ? [1, 2, 3, 4].map((id) => <BookSkeleton key={id} />)
          : books.map((book) => <BookCard book={book} key={book.id} />)}
      </div>
    </section>
  )
}

export default ForYou
