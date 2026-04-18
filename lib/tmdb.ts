const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTMDB(endpoint: string, lang: string = 'fr-FR') {
  const token = process.env.TMDB_API_KEY;
  if (!token) return [];

  try {
    const separator = endpoint.includes('?') ? '&' : '?';
    const url = `${TMDB_BASE_URL}${endpoint}${separator}language=${lang}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, accept: 'application/json' },
      next: { revalidate: 3600 } 
    });

    if (!res.ok) throw new Error("Erreur avec l'API TMDB");
    const data = await res.json();
    
    // FILTRE INTRANSIGEANT : On bannit tout contenu sans affiche officielle
    if (data.results) {
      return data.results.filter((item: any) => 
        item.poster_path && item.poster_path.trim() !== "" && 
        item.backdrop_path && item.backdrop_path.trim() !== ""
      );
    }
    return data; 
  } catch (error) {
    return [];
  }
}

export const getTrending = (lang?: string) => fetchTMDB("/trending/all/day?page=1", lang);
export const getActionMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=28&page=1", lang);
export const getRomanceMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=10749&page=1", lang);
export const getHorrorMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=27&page=1", lang);
export const getPopularMovies = (lang?: string) => fetchTMDB("/movie/popular?page=1", lang);
export const getPopularSeries = (lang?: string) => fetchTMDB("/tv/popular?page=1", lang);
export const getPopularAnime = (lang?: string) => fetchTMDB("/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc&page=1", lang);
export const getItemDetails = (type: string, id: string, lang?: string) => fetchTMDB(`/${type}/${id}?append_to_response=credits,videos,recommendations`, lang);
export const getMoviesByProvider = (providerId: string, lang?: string) => fetchTMDB(`/discover/movie?with_watch_providers=${providerId}&watch_region=US&sort_by=popularity.desc`, lang);
export const getSeriesByProvider = (providerId: string, lang?: string) => fetchTMDB(`/discover/tv?with_watch_providers=${providerId}&watch_region=US&sort_by=popularity.desc`, lang);

// NOUVELLES CATÉGORIES
export const getComedyMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=35&page=1", lang);
export const getSciFiMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=878&page=1", lang);
export const getMysteryMovies = (lang?: string) => fetchTMDB("/discover/movie?with_genres=964&page=1", lang);
export const getDocumentaries = (lang?: string) => fetchTMDB("/discover/movie?with_genres=99&page=1", lang);
export const getKDramas = (lang?: string) => fetchTMDB("/discover/tv?with_original_language=ko&page=1&sort_by=popularity.desc", lang);
export const getStudioGhibli = (lang?: string) => fetchTMDB("/discover/movie?with_companies=10342&sort_by=popularity.desc&page=1", lang);