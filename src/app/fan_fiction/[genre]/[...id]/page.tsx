import { WorkShow } from "@/app/components/work";
import { GetGenre, GetGenres } from "@/app/data/data";

export async function generateStaticParams() {
  const result =  (
    await Promise.all(
      (await GetGenres()).genres.filter((v) => v.is_fan_fiction).map((v) => GetGenre(v.path).then((v) => v.works))
    )
  ).map((v) =>
    v.map((w) => {
      const t = w.path.split("/");
      return {
        genre: t[1],
        id: t.slice(2),
      };
    })
  ).flat();
  console.log(result)
  return result;
}

export default async function Work({ params }: { params: { genre: string; id: string[] } }) {
  const work = (await GetGenre("fan_fiction/" + params.genre)).works.filter(
    (v) => v.path.split("/").slice(2).join("/") === params.id.join("/")
  )[0];
  console.log(work)
  return (
    <main>
        <WorkShow work={work}/>
    </main>
  )
}
