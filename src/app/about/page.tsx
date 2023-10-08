import { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて | Sayonara Voyage",
};

export default async function About() {
  return (
    <main>
      <h3 className="text-xl font-bold my-4">このサイトについて</h3>
      <div className="max-w-xl mx-auto my-2">
        <p>このWebサイトは藤谷光が自作の小説を管理したり公開するためのサイトです。</p>
        <p>二次創作とオリジナルの両方を扱います。</p>
        <p>また、過去に頒布した本の再録なども行っています。</p>
        <p>お問い合わせ等ありましたら、メールアドレスか、Twitterまでお願いします。</p>
      </div>
    </main>
  );
}
