import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiPlay } from 'react-icons/fi'

const API = 'https://us-central1-summaristt.cloudfunctions.net/getBook'

const fallbackBook = {
  id: 'atomic-habits',
  title: 'Atomic Habits',
  author: 'James Clear',
  imageLink: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  summary: 'Atomic Habits reveals practical strategies for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results.',
  audioLink: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
}

function Player({ onFinished }) {
  const { id } = useParams()
  const audioRef = useRef(null)
  const [book, setBook] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

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

  const togglePlay = async () => {
    if (!audioRef.current) return

    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
      return
    }

    try {
      await audioRef.current.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const skip = (seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds),
    )
  }

  const seek = (event) => {
    const nextProgress = Number(event.target.value)
    setProgress(nextProgress)

    if (audioRef.current?.duration) {
      audioRef.current.currentTime = (nextProgress / 100) * audioRef.current.duration
    }
  }

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }

  if (!book) {
    return <main className="content"><p className="kicker">LOADING PLAYER</p><h1>Preparing your briefcast...</h1></main>
  }

  return (
    <main className="player-page">
      <Link className="back-link" to={`/book/${book.id}`}>
        <FiChevronLeft /> Back to book
      </Link>

      <div className="player-inner">
        <img className="player-cover" src={book.imageLink} alt={book.title} />
        <p className="kicker">NOW PLAYING</p>
        <h1>{book.title}</h1>
        <p className="player-author">{book.author}</p>

        <div className="audio-controls">
          <div className="time-row">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={seek}
            aria-label="Audio progress"
          />

          <div className="player-buttons">
            <button type="button" onClick={() => skip(-15)} aria-label="Skip back 15 seconds">
              <FiChevronLeft />
            </button>
            <button className="play-button" type="button" onClick={togglePlay} aria-label={playing ? 'Pause audio' : 'Play audio'}>
              {playing ? '❚❚' : <FiPlay />}
            </button>
            <button type="button" onClick={() => skip(15)} aria-label="Skip forward 15 seconds">
              <FiChevronRight />
            </button>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={book.audioLink}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => {
            const audio = event.currentTarget
            setCurrentTime(audio.currentTime)
            setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0)
          }}
          onEnded={() => {
            setPlaying(false)
            onFinished(book)
          }}
        />

        <div className="player-summary">
          <p className="kicker">SUMMARY</p>
          <p>{book.summary}</p>
        </div>
      </div>
    </main>
  )
}

export default Player
