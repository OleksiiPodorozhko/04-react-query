import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar.tsx';
import { getMovies } from '../../services/movieService.ts';
import type { Movie } from '../../types/movie.ts';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  }
  const closeModal = () => setSelectedMovie(null);

  const onSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);

      //TODO temp
      // await new Promise(resolve => setTimeout(resolve, 1000));

      const movies = await getMovies(query);

      if (movies.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies([...movies]);
    } catch {
      toast.error('Something went wrong!');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <SearchBar onSubmit={onSubmit} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </>
  );
}
