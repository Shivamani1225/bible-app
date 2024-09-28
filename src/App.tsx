import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [verseText, setVerseText] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [error, setError] = useState('');

  const baseUrl = 'https://labs.bible.org/api/';

  useEffect(() => {
    getVerseOfTheDay();
  }, []);

  const fetchVerse = async (passage) => {
    setError('');
    try {
      const response = await axios.get(baseUrl, {
        params: {
          passage,
          formatting: 'plain',
          type: 'json'
        }
      });
      if (response.data && response.data.length > 0) {
        const verse = response.data[0];
        setVerseText(`${verse.bookname} ${verse.chapter}:${verse.verse} - ${verse.text}`);
      } else {
        setError('No verse found. Please check your input.');
      }
    } catch (error) {
      console.error('Error fetching verse:', error);
      setError('Error fetching verse. Please try again.');
    }
  };

  const getRandomVerse = () => fetchVerse('random');

  const getVerseOfTheDay = () => fetchVerse('votd');

  const getSpecificVerse = () => {
    if (book && chapter && verse) {
      fetchVerse(`${book} ${chapter}:${verse}`);
    } else {
      setError('Please enter book, chapter, and verse.');
    }
  };

  return (
    <div className="App">
      <h1>Bible Verses App</h1>
      <section>
        <h2>Verse of the Day</h2>
        <button onClick={getVerseOfTheDay}>Get Verse of the Day</button>
      </section>

      <section>
        <h2>Random Verse</h2>
        <button onClick={getRandomVerse}>Get Random Verse</button>
      </section>

      <section>
        <h2>Specific Verse</h2>
        <input
          type="text"
          placeholder="Book"
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chapter"
          value={chapter}
          onChange={(e) => setChapter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Verse"
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
        />
        <button onClick={getSpecificVerse}>Get Verse</button>
      </section>

      {error && <p className="error">{error}</p>}
      {verseText && <p className="verse" dangerouslySetInnerHTML={{ __html: verseText }}></p>}

      <footer>
        <small>Uses the NET Bible API. Please comply with the NET Bible Copyright.</small>
      </footer>
    </div>
  );
}

export default App;