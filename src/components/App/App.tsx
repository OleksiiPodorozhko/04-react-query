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
import css from './App.module.css';
import ReactPaginate from 'react-paginate';

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  }
  const closeModal = () => setSelectedMovie(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', search, currentPage],
    queryFn: () => getMovies(search, currentPage),
    enabled: !!search.trim(),
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (!isLoading && !isError && data?.results?.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [data, isLoading, isError]);

  const handleSearch = (search: string) => {
    setSearch(search);
    setCurrentPage(1);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
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
