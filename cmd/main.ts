import fs from "fs/promises";
import { glob } from "glob";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { text } from "stream/consumers";
import path from "path";

dayjs.extend(timezone);

type Genre = {
  name: string;
  is_fan_fiction: boolean;
  path: string;
  works: Work[];
  series: Series[];
};

type WorkInfo = {
  title: string;
  author: string;
  caption: string;
  tag: string[];
  date: string;
  files?: string[];
};

type Work = {
  title: string;
  author: string;
  caption: string;
  tag: string[];
  date: dayjs.Dayjs;
  texts: string[];
  path: string;
  genre: string; // ジャンルへのパス
};

type Series = {
  name: string;
  description: string;
  works: string[];
  genre: string; // ジャンルへのパス
};

const findGenres = async (root: string): Promise<Genre[]> => {
  const genres = new Array<Genre>();
  const genreFiles = await glob(root + "/**/genre.json");
  for (const p of genreFiles) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString());
    const genre = { ...info, path: path.dirname(p) } as Genre;
    genres.push(genre);
  }
  return genres;
};

const findSeries = async (dir: string) => {
  const jsons = await glob(dir + "/**/series.json");
  const serieses = new Array<Series>();
  for (const p of jsons) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString());
    const works = (await glob(path.dirname(p) + "/**/work.json")).map((v) => path.dirname(v));
    serieses.push({ ...info, works: works, genre: dir });
  }
  return serieses;
};

const findWorks = async (parent: string) => {
  const workFiles = await glob(parent + "/**/work.json");
  const works = new Array<Work>();
  for (const p of workFiles) {
    const json = await fs.readFile(p);
    const info = JSON.parse(json.toString()) as WorkInfo;
    const texts = new Array<string>();
    const dir = path.dirname(p);
    for (const t of info.files ?? ["text.txt"]) {
      const text = (await fs.readFile(path.join(dir, t))).toString();
      if (text.split("\n").length > 2) {
        texts.push(text);
      } else {
        // シンボリックリンクが壊れてファイルのパスを一行記述したファイルになることがあるので、その時の対策
        texts.push((await fs.readFile(path.join(dir, text))).toString());
      }
    }
    const work = { ...info, date: dayjs(info.date, "YYYY/MM/DD"), path: dir, texts, genre: dir } as Work;
    works.push(work);
  }
  return works;
};

const normalizePath = (obj: { path?: string; genre?: string }, root: string) => {
  if (obj.path) obj.path = obj.path.split(root + "/")[1];
  if (obj.genre) obj.genre = obj.genre.split(root + "/")[1];
  return obj;
};

const normalizePaths = (paths: { path?: string; genre?: string }[], root: string) => {
  return paths.map((p) => normalizePath(p, root));
};

const main = async (args: string[]) => {
  console.log(args, process.argv0);
  const root = args[args.length - 1];
  const genres = await findGenres(args[args.length - 1]);
  console.log(genres);
  for (const genre of genres) {
    const works = (await findWorks(genre.path)).sort((a, b) => (a.date.isAfter(b.date) ? -1 : 1));
    const series = await findSeries(genre.path);

    const obj = {
      ...normalizePath(genre, root),
      works: normalizePaths(works, root),
      series: normalizePaths(series, root),
    };
    await fs.writeFile("dist/" + path.basename(genre.path) + ".json", JSON.stringify(obj));
  }
  await fs.writeFile("dist/genre.json", JSON.stringify(genres));
};

main(process.argv);
