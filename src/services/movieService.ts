import axios from "axios";
import type { Movie } from '../types/movie.ts';
const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieApiResponse {
  results: Movie[];
}

export async function getMovies(query: string): Promise<Movie[]> {
  const response = await axios<MovieApiResponse>({
    method: 'get',
    baseURL: 'https://api.themoviedb.org/3/',
    url: `/search/movie`,
    params: {
      query,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${VITE_TMDB_TOKEN}`,
    },
  });

  return response.data.results;
}