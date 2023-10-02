import Image from "next/image";

type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
};

export default async function Home() {
  const response = await fetch("http://localhost:3000/api")
  const genres = response.ok ? ((await response.json()) as { genres: Genre[]}) : { genres: []};
  console.log(genres)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h3>小説</h3>
      {genres.genres.map((v) => (
        <p>{v.name}</p>
      ))}
    </main>
  );
}
