import { WorkShow } from "@/app/components/work";
import { GetGenre } from "@/app/data/data";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const work = (await GetGenre("original")).works.filter((v) => v.path.split("/")[1] === params.id)[0];
  return {
    title: `${work.title} | Sayonara Voyage`,
    description: `${work.title} | オリジナル小説`,
  };
}

export async function generateStaticParams() {
  const result = (await GetGenre("original")).works
    .map((v) => v.path)
    .map((p) => p.replace("original/", ""))
    .map((v) => ({ id: v }));
  console.log(result);
  return result;
}

export default async function OriginalId({ params }: { params: { id: string } }) {
  const work = (await GetGenre("original")).works.filter((v) => v.path.split("/")[1] === params.id)[0];
  return (
    <main>
      <WorkShow work={work} />
    </main>
  );
}
