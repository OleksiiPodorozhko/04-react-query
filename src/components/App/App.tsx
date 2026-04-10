import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { getMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import { useQuery } from '@tanstack/react-query';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  }
  const closeModal = () => setSelectedMovie(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', search],
    queryFn: () => getMovies(search),
    enabled: !!search.trim(),
  });

  useEffect(() => {
    if (!isLoading && !isError && data?.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isLoading, isError]);

  const movies = data ?? [];

  return (
    <>
      <div>
        <Toaster />
      </div>
      <SearchBar onSubmit={(search: string) => setSearch(search)} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        movies.length > 0 && (
          <MovieGrid onSelect={openModal} movies={movies} />
        )
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
