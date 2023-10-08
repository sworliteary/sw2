import * as React from "react";
import { GetRecentWorks } from "../data/data";
import { WorkInfoList } from "../components/work";

export default async function Recent() {
  const recent = (await GetRecentWorks()).slice(0, 10);
  return (
    <main>
      <WorkInfoList works={recent} />
    </main>
  );
}
