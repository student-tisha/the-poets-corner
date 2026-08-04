import { useState } from 'react';
import './App.css';

const SUGGESTIONS = ['Heartbreak', 'Love', 'Friendship', 'Nature', 'Motivation', 'Hope', 'Loneliness', 'Rain'];

function PoemCard({ poem, isFavorite, onToggleFavorite }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const isLong = poem.poem.length > 400;

  const handleCopy = () => {
    const text = `${poem.title}\nby ${poem.poet}\n\n${poem.poem}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="poem-card">
      <div className="poem-card-top">
        <div>
          <h2>{poem.title}</h2>
          <div className="poet-name">by {poem.poet}</div>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(poem)}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      {poem.tags.length > 0 && (
        <div className="tags">
          {poem.tags.slice(0, 6).map((tag, i) => (
            <span className="tag" key={i}>{tag}</span>
          ))}
        </div>
      )}
      <div className={`poem-text ${expanded ? 'expanded' : ''}`}>
        {poem.poem}
      </div>
      <div className="card-actions">
        {isLong && (
          <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read full poem'}
          </button>
        )}
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy poem'}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const addToHistory = (term) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 8);
    });
  };

  const runSearch = async (searchTerm) => {
     const term = searchTerm.trim();

     if (!term) {
       setError('Please enter a mood, feeling, or occasion to search for.');
       return;
     }

     if (term.length < 2) {
       setError('Please enter at least 2 characters.');
       return;
     }

     setLoading(true);
     setError('');
     setHasSearched(true);
     setShowFavoritesOnly(false);

     try {
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 10000);

       const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   const res = await fetch(
     `${apiUrl}/api/poems/recommend?mood=${encodeURIComponent(term)}`,
     { signal: controller.signal }
   );
       clearTimeout(timeoutId);

       if (!res.ok) {
         throw new Error(`Server responded with status ${res.status}`);
       }

       const data = await res.json();
       setPoems(data.poems || []);
       addToHistory(term);
     } catch (err) {
       if (err.name === 'AbortError') {
         setError('The search took too long. Please try again.');
       } else if (err.message.includes('Failed to fetch')) {
         setError('Cannot connect to the server. Please check that the backend is running and try again.');
       } else {
         setError('Something went wrong while fetching poems. Please try again.');
       }
       setPoems([]);
     } finally {
       setLoading(false);
     }
   };
  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleSuggestionClick = (mood) => {
    setQuery(mood);
    runSearch(mood);
  };

  const toggleFavorite = (poem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.title === poem.title && f.poet === poem.poet);
      if (exists) {
        return prev.filter((f) => !(f.title === poem.title && f.poet === poem.poet));
      }
      return [...prev, poem];
    });
  };

  const isFavorite = (poem) =>
    favorites.some((f) => f.title === poem.title && f.poet === poem.poet);

  const displayedPoems = showFavoritesOnly ? favorites : poems;

  return (
    <div className={`app ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="top-bar">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <button
          className={`favorites-toggle ${showFavoritesOnly ? 'active' : ''}`}
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        >
          ★ Favorites ({favorites.length})
        </button>
      </div>

      <div className="header">
        <h1>The Poet's Corner</h1>
        <p>Find the perfect poem for your mood</p>
      </div>

      {!showFavoritesOnly && (
        <>
          <form className="search-box" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="How are you feeling? (e.g. heartbreak, hope, rain...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="suggestions">
            {SUGGESTIONS.map((mood) => (
              <button key={mood} onClick={() => handleSuggestionClick(mood)}>
                {mood}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="history">
              <span className="history-label">Recent:</span>
              {history.map((term, i) => (
                <button key={i} className="history-chip" onClick={() => handleSuggestionClick(term)}>
                  {term}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {loading && (
  <div className="loading-skeleton">
    {[1, 2, 3].map((n) => (
      <div className="skeleton-card" key={n}>
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-sub"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line skeleton-short"></div>
      </div>
    ))}
  </div>
)}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && hasSearched && !showFavoritesOnly && (
        <div className="results-count">
          {poems.length > 0
            ? `Found ${poems.length} poem${poems.length > 1 ? 's' : ''} for "${query}"`
            : `No poems found for "${query}". Try another mood.`}
        </div>
      )}

      {showFavoritesOnly && (
        <div className="results-count">
          {favorites.length > 0
            ? `${favorites.length} favorite poem${favorites.length > 1 ? 's' : ''}`
            : 'No favorites yet. Click the star on any poem to save it here.'}
        </div>
      )}

      {!loading && displayedPoems.map((poem, i) => (
        <PoemCard
          poem={poem}
          key={i}
          isFavorite={isFavorite(poem)}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}

export default App;