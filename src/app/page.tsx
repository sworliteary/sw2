import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";
import { GetRecentWorks } from "./data/data";
import { WorkInfo, WorkInfoList } from "./components/work";

type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
};

export default async function Home() {
  const file = await readFile(path.join(process.cwd(), "dist", "genre.json"));
  const genres = { genres: JSON.parse(file.toString()) as Genre[] };
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
