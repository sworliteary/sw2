import Link from "next/link";
import { GetGenres, GetRecentWorks } from "./data/data";
import { WorkInfoList } from "./components/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayonara Voyage",
  description: "藤谷光の小説置き場です。",
};

export default async function Home() {
  const genres = await GetGenres();
  const recent = (await GetRecentWorks()).slice(0, 3);
  return (
    <main>
      <WorkInfoList works={recent} />
      <div className="max-w-xl my-1 mx-auto ">
        <h3>ジャンル</h3>
        <div className="px-20 text-sm">
          {genres.genres.map((v) => (
            <div>
              {`❏ `}
              <Link href={v.path}>{v.name}</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
