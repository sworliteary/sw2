import * as React from "react";
import { GetRecentWorks } from "../data/data";
import { WorkInfoList } from "../components/work";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "最近の更新 | Sayonara Voyage",
  description: "最近の更新のページの一覧です。",
};

export default async function Recent() {
  const recent = (await GetRecentWorks()).slice(0, 10);
  return (
    <main>
      <h3 className="text-center">最近の更新</h3>
      <WorkInfoList works={recent} />
    </main>
  );
}
