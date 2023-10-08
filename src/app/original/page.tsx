import * as React from "react";
import { GetGenre } from "../data/data";
import { WorkInfoList } from "../components/work";

export default async function Original() {
  const genre = await GetGenre("original");
  return (
    <main>
      <h3>オリジナル</h3>
      <WorkInfoList works={genre.works} option={{ hideGenre: true }} />
    </main>
  );
}
