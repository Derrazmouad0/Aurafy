import MovieCard from "../../../components/movies/MovieCard";
import { getPopularAnime } from "../../../lib/tmdb";

export default async function AnimePage() {
  const animes = await getPopularAnime();

  return (
    <div className="w-full bg-deepBlack min-h-screen pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-20">
        
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-10 bg-accentBlue rounded-full glow-blue"></span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Univers Animé
            </h1>
          </div>
          <p className="text-textGray text-lg max-w-2xl font-light">
            Le meilleur de l'animation japonaise. Explorez des mondes fantastiques, des shōnens épiques et des classiques intemporels.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">Animes les plus suivis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {animes.map((anime: any) => (
              <MovieCard key={`anime-${anime.id}`} movie={anime} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}