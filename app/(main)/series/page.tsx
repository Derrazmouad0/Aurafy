import MovieCard from "../../../components/movies/MovieCard";
import { getPopularSeries } from "../../../lib/tmdb";

export default async function SeriesPage() {
  const popularSeries = await getPopularSeries();

  return (
    <div className="w-full bg-deepBlack min-h-screen pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 space-y-20">
        
        <div>
          <div className="flex items-center gap-4 mb-4">
            <span className="w-2 h-10 bg-accentPink rounded-full glow-pink"></span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
              Séries TV
            </h1>
          </div>
          <p className="text-textGray text-lg max-w-2xl font-light">
            Plongez dans les meilleures productions télévisuelles mondiales. Binge-watchez vos saisons préférées sans modération.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">Séries du moment</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8">
            {popularSeries.map((series: any) => (
              <MovieCard key={`series-${series.id}`} movie={series} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}