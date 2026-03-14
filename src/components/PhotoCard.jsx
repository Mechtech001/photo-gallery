import React from 'react';

export function PhotoCard({ photo, isFavorite, onToggleFavorite }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800 dark:ring-slate-700/50">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={photo.download_url}
          alt={`Photo by ${photo.author}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 z-10 transition-colors">
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate pr-4" title={photo.author}>
          {photo.author}
        </span>
        
        <button
          onClick={() => onToggleFavorite(photo.id)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-95 ${
            isFavorite 
              ? 'bg-rose-50 dark:bg-rose-500/10' 
              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700'
          }`}
          aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorite 
                ? 'text-rose-500 dark:text-rose-400' 
                : 'text-slate-400 dark:text-slate-300 group-hover:text-rose-400'
            }`}
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
