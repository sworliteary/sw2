import * as React from "react";
import { GetGenre } from "../data/data";
import { WorkInfoList } from "../components/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "オリジナル | Sayonara Voyage",
  description: "オリジナル作品 | Sayonara Voyage",
};

export default async function Original() {
  const genre = await GetGenre("original");
  return (
    <main>
      <h3 className="text-center">❏ オリジナル</h3>
      <WorkInfoList works={genre.works} option={{ hideGenre: true }} />
    </main>
  );
}
