import "./globals.css";
import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import Link from "next/link";

const DancingScript = Dancing_Script({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Zen+Old+Mincho&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="header my-4">
          <h1 className={`${DancingScript.className} text-center text-4xl my-4`}>
            <Link href="/" className="text-white font-black">
              Sayonara VoyagE
            </Link>
          </h1>
          <p className={`${DancingScript.className} text-center my-1`}>Use me like an oar and get yourself to shore</p>
          <div className="flex flex-row items-center justify-around">
            <span>
              <Link href="/recent">最近の投稿</Link>
            </span>
            <span>
              <Link href="/about">このサイトについて</Link>
            </span>
          </div>
        </div>
        {children}
        <div className="text-center my-3 text-sm">
          <p>
            <a href="https://sayonara.voyage" target="_blank" rel="noopener noreferrer">
              作者HP
            </a>
            / <a href="https://forms.gle/h8L5MZdDbPatCq2G8">感想フォーム</a> /
            <a href="mailto:shnovels@gmail.com">お問い合わせ(メール)</a>
          </p>
        </div>
      </body>
    </html>
  );
}
