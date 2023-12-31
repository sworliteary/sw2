import { WorkInfoList } from "@/app/components/work";
import { GetAllWorks } from "@/app/data/data";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tag = decodeURIComponent(params.id);
  return {
    title: `#${tag} | Sayonara Voyage`,
    description: `#${tag} のタグがついた作品の一覧 | Sayonara Voyage`,
  };
}
export async function generateStaticParams() {
  const tags = (await GetAllWorks())
    .map((v) => v.tag ?? [])
    .flat()
    .filter((v, i, z) => z.indexOf(v) === i)
    .map((t) => [
      {
        id: t,
      },
      {
        id: encodeURIComponent(t), // ローカルの開発時に必要になるので入れざるを得ない！
      },
    ])
    .flat();
  return tags;
}

export default async function Tag({ params: { id } }: { params: { id: string } }) {
  const tag = decodeURIComponent(id);
  const works = (await GetAllWorks()).filter((v) => (v.tag ?? []).includes(tag));
  return (
    <main>
      <h3 className="text-center">#{tag}</h3>
      <WorkInfoList works={works} />
    </main>
  );
}
