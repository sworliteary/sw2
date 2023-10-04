import Link from "next/link"

type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
};

export default async function Home() {
  const response = await fetch("http://localhost:3000/api")
  const genres = response.ok ? ((await response.json()) as { genres: Genre[]}) : { genres: []};
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3>最近の投稿</h3>
      <h3>ジャンル</h3>
      <div className="max-w-lg my-1 mx-auto">
      {genres.genres.map((v) => (
        <div>{`❏ `}<Link href={v.path}>{v.name}</Link></div>
      ))}
      </div>
    </main>
  );
}
