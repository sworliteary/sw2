import dayjs, { Dayjs } from "dayjs";
import { readFile } from "fs/promises";
import path from "path";

export type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
};

export type Work = {
  title: string;
  date: string;
  tag?: string[];
  caption?: string;
  path: string;
  texts: string[];
  genre: string;
  draft?: boolean;
};

export type Series = {
  name: string;
  description: string;
  works: string[];
  genre: string;
};

type GenreWithWorks = Genre & {
  works: Work[];
  series: Series[];
};

export const GetGenres = async () => {
  const genres = JSON.parse((await readFile(path.join(process.cwd(), "dist", "genre.json"))).toString()) as Genre[];
  const details = (await Promise.all(genres.map((v) => GetGenre(v.path)))).filter(
    (v) => v.works.filter((v) => !v.draft).length > 0
  );
  return { genres: details };
};

export const GetGenre = async (genre: string): Promise<GenreWithWorks> => {
  const file = await readFile(path.join(process.cwd(), "dist", genre + ".json"));
  return JSON.parse(file.toString()) as GenreWithWorks;
};

export const GetAllWorks = async (): Promise<Work[]> => {
  const genres = await GetGenres();
  return (await Promise.all(genres.genres.map((v) => GetGenre(v.path)))).map((v) => v.works).flat();
};

export const GetRecentWorks = async (): Promise<Work[]> => {
  const works = await GetAllWorks();
  return works.sort((a, b) => (dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1));
};
