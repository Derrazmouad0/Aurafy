import MovieCard from "../../../components/movies/MovieCard";
import { getPopularMovies, getActionMovies, getHorrorMovies } from "../../../lib/tmdb";

export default async function MoviesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const isEnglish = (await searchParams).lang === "en";
  const apiLang = isEnglish ? "en-US" : "fr-FR";
  const [popular, action, horror] = await Promise.all([getPopularMovies(apiLang), getActionMovies(apiLang), getHorrorMovies(apiLang)]);

  return (
    <div className="w-full bg-deepBlack min-h-screen pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-20">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-10 bg-signaturePurple rounded-full glow-purple"></span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">{isEnglish ? "Movies" : "Cinéma"}</h1>
          </div>
          <p className="text-textGray text-lg max-w-2xl font-light">
            {isEnglish ? "Discover the most popular feature films right now." : "Découvrez les longs-métrages les plus populaires du moment."}
          </p>
        </div>
        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">{isEnglish ? "Popular Movies" : "Films Populaires"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {popular.map((movie: any) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">{isEnglish ? "Action Movies" : "Action Explosive"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {action.map((movie: any) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">{isEnglish ? "Horror & Thrills" : "Horreur & Frissons"}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {horror.map((movie: any) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </section>
      </div>
    </div>
  );
}