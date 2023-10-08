import { WorkShow } from "@/app/components/work";
import { GetGenre, GetGenres } from "@/app/data/data";

export async function generateStaticParams() {
  const result = (
    await Promise.all(
      (await GetGenres()).genres.filter((v) => v.is_fan_fiction).map((v) => GetGenre(v.path).then((v) => v.works))
    )
  )
    .map((v) =>
      v.map((w) => {
        const t = w.path.split("/");
        const pages = w.texts.length;
        const base = {
          genre: t[1],
          id: t.slice(2),
        };
        return new Array<{ genre: string; id: string[] }>(pages)
          .fill(base)
          .map((v, i) => ({ ...v, id: i > 0 ? [...v.id, `page_${i}`] : v.id }));
      })
    )
    .flat()
    .flat();
  return result;
}

export default async function Work({ params }: { params: { genre: string; id: string[] } }) {
  const withPage = params.id[params.id.length - 1].startsWith("page_");

  const workpath = withPage ? params.id.slice(0, params.id.length - 1) : params.id;
  const work = (await GetGenre("fan_fiction/" + params.genre)).works.filter(
    (v) => v.path.split("/").slice(2).join("/") === workpath.join("/")
  )[0];
  const page = withPage ? Number(params.id[params.id.length - 1].replace("page_", "")) : undefined;
  return (
    <main>
      <WorkShow work={work} page={page} />
    </main>
  );
}
