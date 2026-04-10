import axios from "axios";
import type { Movie } from '../types/movie.ts';
const VITE_TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

interface MovieApiResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export async function getMovies(
  query: string,
  page: number
): Promise<MovieApiResponse> {
  const response = await axios<MovieApiResponse>({
    method: 'get',
    baseURL: 'https://api.themoviedb.org/3/',
    url: `/search/movie`,
    params: {
      query,
      page,
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${VITE_TMDB_TOKEN}`,
    },
  });

  return response.data;
}