import { useState, useEffect } from 'react';

export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // cancel fetch if the component unmounts
    const abortController = new AbortController();
    
    const fetchPhotos = async () => {
      try {
        const response = await fetch('https://picsum.photos/v2/list?limit=30', {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos. Server responded with an error.');
        }
        
        const data = await response.json();
        setPhotos(data);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();

    return () => {
      abortController.abort();
    };
  }, []);

  return { photos, loading, error };
}
