import React, { useReducer, useMemo, useCallback, useState, useEffect } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import { PhotoCard } from './PhotoCard';

function favoritesReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const isFav = state.includes(action.payload);
      return isFav
        ? state.filter(id => id !== action.payload)
        : [...state, action.payload];
    }
    default:
      return state;
  }
}

function initFavorites() {
  try {
    const saved = localStorage.getItem('gallery_favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Failed to access localStorage:', e);
    return [];
  }
}

export function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  
  // manage favorites with a reducer
  const [favorites, dispatch] = useReducer(favoritesReducer, [], initFavorites);
  const [search, setSearch] = useState('');

  // save favorites to local storage so they don't disappear on refresh
  useEffect(() => {
    try {
      localStorage.setItem('gallery_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [favorites]);

  // memoize search handler
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleToggleFavorite = useCallback((id) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  }, []);

  // only run filter when photos or search text change
  const filteredPhotos = useMemo(() => {
    if (!search.trim()) return photos;
    const lowerSearch = search.toLowerCase();
    return photos.filter(photo => photo.author.toLowerCase().includes(lowerSearch));
  }, [photos, search]);

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="mb-4 rounded-full bg-rose-100 p-4 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Failed to load photos</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-0">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl drop-shadow-sm">
            Gallery<span className="text-indigo-600 dark:text-indigo-400">.</span>
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Discover beautiful moments captured by amazing artists.
          </p>
        </div>
        
        <div className="w-full md:w-[28rem] relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5 text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by author name..."
            value={search}
            onChange={handleSearchChange}
            className="block w-full rounded-full border-0 bg-white py-3.5 pl-11 pr-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200/80 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 transition-shadow hover:shadow-md dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-800 dark:border-t-indigo-500"></div>
            <p className="text-slate-500 font-medium">Fetching photos...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredPhotos.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center text-slate-500 dark:text-slate-400 animate-in fade-in duration-500">
              <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-8 w-8 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">No photos found for "{search}"</p>
              <p className="mt-1 text-sm">Try searching for a different author.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in slide-in-from-bottom-4 fade-in duration-700">
              {filteredPhotos.map((photo) => (
                <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  isFavorite={favorites.includes(photo.id)} 
                  onToggleFavorite={handleToggleFavorite} 
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
