import { WorkInfoList } from "@/app/components/work";
import { GetGenre, GetGenres } from "@/app/data/data";

export async function generateStaticParams() {
  const genres = await GetGenres();
  const v =  genres.genres.filter((v) => v.is_fan_fiction).map((v) => ({genre: v.path.replace("fan_fiction/", "")}));
  return v
}

export default async function Genre({ params }: { params: { genre: string } }) {
  const genre = await GetGenre("fan_fiction/" + params.genre);
  return (
    <main>
      <h3>❏ {genre.name}</h3>
      <WorkInfoList works={genre.works} option={{ hideGenre: true }} />
    </main>
  );
}
